'''
'''
import json

from bottle import get, static_file, request, post, run, abort, delete

from os_space import create_log, Struct
from os_space.model.updates import SatelliteUpdate
from os_space.web.mappings import station2dict, satellite2dict
from os_space.model.satellite import SATELLITE_STATUS


log = create_log('api')



def call_listeners(listeners, msg_name, msg_params):
    for listener in listeners:
        try:
            listener(msg_name, msg_params)
        except Exception as ex:
            log.warn(ex)

def get_ground_station():
    from os_space.model.ground_station import GroundStation  # @UnusedImport
    model = GroundStation.stations[request.environ["SERVER_PORT"]]
    return model

def area_updates(model):
    updates = []
    for sat_id, satellite in model._tracked_satellites.items():
        if satellite.status() == SATELLITE_STATUS.receiving:
            last_up = satellite.last_update()
            updates.append({"name":sat_id})
    return updates


# Static Routes
@get('/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root='../')

# Static Routes
@get('/<filename:re:.*\.html>')
def html(filename):
    return static_file(filename, root='../')

@get('/<filename:re:.*\.css_custom>')
def stylesheets(filename):
    return static_file(filename, root='../')

@get('/<filename:re:.*\.(jpg|png|gif|ico)>')
def images(filename):
    return static_file(filename, root='../')

@get('/<filename:re:.*\.(eot|ttf|woff|svg)>')
def fonts(filename):
    return static_file(filename, root='../')



"""
  @api {get} /ground_stations GET /ground_stations 
  @apiName list ground stations
  @apiGroup Ground Stations
  @apiDescription Ground Station List
  
  @apiParam {Number} [length=10]        QueryString. Records returned, default 10, max 100.
  @apiParam {Number} [start=0]          QueryString. Offset , default 0
  @apiParam {String} [search]           QueryString. Station name or description
  
  @apiSuccess {Number} recordsFiltered Ground Stations matching the search criteria count.
  @apiSuccess {Number} recordsTotal  Ground Stations count.
  @apiSuccess {Station[]}  data  Ground Stations data array.
  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
      {
          data:[
              { "name":"groundeze", "lat":-34.572716 , "lon":-58.538507,"time":"1:58:25 pm PST"},
              { "name":"groundtincho", "lat":-35.572716 , "lon":-59.538507,"time":"1:58:30 pm PST"}],
          recordsFiltered:2,
          recordsTotal:2
      }
"""
@get('/ground_stations')
def ground_stations():
    length = int(request.query.length or 10)
    offset = int(request.query.offset or 0)
    model = get_ground_station()
    all_stations = model.all_stations().values()
     
    return {"data":map(station2dict, all_stations[offset:offset + length]), "recordsFiltered":len(all_stations), "recordsTotal":len(all_stations)}

"""
  @api {post} /ground_stations POST /ground_stations
  @apiName heartbeat
  @apiGroup Ground Stations
  @apiDescription Heartbeat to the central ground station. Returns data about the other stations
  
  @apiParam {String} [id]           Station name
  @apiParam {String} [endpoint]     Station endpoint (http://ip:port)
  @apiParam {String} [updates]      SatelliteUpdate[] array in string form
  
  @apiParamExample {json} Example: updates param 
      '[{"name": "iss", "id": "25544",  "lat": -54, "source":  ground1,  "status": receiving,... },{...}...]'
  
  @apiSuccess {Station[]}  stations  Ground Stations data array.
  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
      {
          stations:[
              { "name":"groundeze", "lat":-34.572716 , "lon":-58.538507,"time":"1:58:25 pm PST"},
              { "name":"groundtincho", "lat":-35.572716 , "lon":-59.538507,"time":"1:58:30 pm PST"}]
      }
"""
@post('/ground_stations')
def heartbeat(): 
    model = get_ground_station()
    sender = request.forms.id
    endpoint = request.forms.endpoint
    
        
    position = Struct(lat=request.forms.lat, lon=request.forms.lon, alt=request.forms.alt)
    log.debug(sender)
    model.update_ground_station(sender, endpoint, position)
    call_listeners(model.message_listeners, "hearbeat", {"sender":sender}) 
    
    
    updates = json.loads(request.forms.updates)
    
    for update_dict in updates:
        update = SatelliteUpdate(update_dict["id"], update_dict["source"])        
        update.__dict__.update(update_dict)        
        
        model.process_update(update)

    response = map(station2dict, model.all_stations().values())
    return {"stations": response }



"""
  @api {get} /ground_stations/:name  GET /ground_stations/:name
  @apiName request ground station 
  @apiGroup Ground Stations 
  @apiDescription Request information about one Ground Station

  @apiParam {String} name    Ground Station name. If "me" is the name passed (ground_stations/me), the request will return the current station data.

  @apiSuccess {String} name  Ground Station name.
  @apiSuccess {String} lat  Ground Station latitude.
  @apiSuccess {String} lon  Ground Station longidude.
  @apiSuccess {String} time  Ground Station last update recived.
  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
      {
          "name":"groundeze", 
          "lat":-34.572716 , 
          "lon":-58.538507,
          "time":"1:58:25 pm PST"
             
      }
  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "GroundStationNotFound"
        "name":"aNonExistentGroundStationName"
      }
"""
@get('/ground_stations/<name>')
def ground_station(name):
    model = get_ground_station()
    all_stations = model.all_stations()
    
    if name in [x for x in all_stations ]:
        station = all_stations[name]
        return station2dict(station)
    else:
        abort(404, {"error":"Ground station not found", "name":name}) 

"""
  @api {get} /ground_stations/:name/satellites GET /ground_stations/:name/satellites
  @apiName satellites from ground station 
  @apiGroup Ground Stations 
  @apiDescription Request information about the satellites that a Ground Station "can see"

  @apiParam {String} name            Ground Station name.
  @apiParam {String} [online=false]  QueryString.If set to true, only the satellites from where the selected Ground station is recibing data will be return. Otherwise the satellite predictions will be used.
  @apiParam {Number} [length=10]     QueryString. Records returned per request, default 10, max 100.
  @apiParam {Number} [start=0]       QueryString. Offset , default 0
  
  @apiSuccess {Number} recordsTotal  Total number of satellites that the selected Ground Station can see.
  @apiSuccess {Satellite[]} data  Satellites that the Ground Station can see.

  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
      {
          data:[
              { "name":"iss", "id":25544 , "time":"1:58:25 pm PST", "status":"non-visible" },
              { "name":"CubeBug-1", "id":"13018D" , "time":"1:58:30 pm PST","status":"visible"}],
          recordsFiltered:2,
          recordsTotal:2             
      }  
"""
@get('/ground_stations/<name>/satellites')
def ground_station_satellites(name):
 """
   if name in [x[name] for x in [groundeze, groundtincho]]: 
        return {"groundeze":groundeze, "groundtincho":groundtincho}[name]
"""
"""
    else:
        abort(404, {"error":"Ground station not found", "name":name}) 
"""

"""
  @api {get} /satellites GET /satellites  
  @apiName list satellites
  @apiGroup Satellites
  @apiDescription Satellite List
  
  @apiParam {Number} [length=10]        QueryString. Records returned, default 10, max 100.
  @apiParam {Number} [start=0]          QueryString. Offset , default 0
  @apiParam {String} [search]           QueryString. Station name or description
  
  @apiSuccess {Number} recordsFiltered Satellites matching the search criteria count.
  @apiSuccess {Number} recordsTotal  Satellites count.
  @apiSuccess {SatelliteStatus[]}  data  Satellites data array.
  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
      {
          "data":[
              { "name":"iss", "id":25544 , "time":"1:58:25 pm PST", "status":"non-visible" },
              { "name":"CubeBug-1", "id":"13018D" , "time":"1:58:30 pm PST","status":"visible"}],
          "recordsFiltered":2,
          "recordsTotal":2
      }
"""
@get('/satellites')
def satellites(): 
    length = request.query.length or 10
    search = request.query.search or None
    type = request.query.type or None
    
    model = get_ground_station()
    all_satellites = model.all_satellites()
    
    if search:
        all_satellites = [ x for x in all_satellites if search.lower() in x.name.lower() or search.lower() in x.id.lower() ]
        
    if type:
        all_satellites = [ x for x in all_satellites if type.lower() == x.type.lower()]
     
    return {"data": [satellite2dict(sat, model.orekit) for sat in all_satellites ] , "recordsFiltered":len(all_satellites), "recordsTotal":len(all_satellites)}

"""
  @api {get} /satellites/:id GET /satellites/:id 
  @apiDescription Request information about one satellite
  @apiName request satellite 
  @apiGroup Satellites 

  @apiParam {String} id    Satellite NORAD assigned number

  @apiSuccess {String} name  Satellite name.
  @apiSuccess {String} lat  Satellite latitude.
  @apiSuccess {String} lon  Satellite longidude.
  @apiSuccess {int} timestamp  of the satellite update.
  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
    {
          {
    "name": "iss",
    "id": "25544",
    "lat": 50.11496269845,
    "lon": 118.07900427317,
    "altitude": 408.05526028199,
    "velocity": 27635.971970874,
    "footprint": 4446.1877699772,
    "timestamp": 1364069476,
    "daynum": 2456375.3411574
    }
             
      
  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "NonExistentSatellite"
        "name":"aNonExistentSatelliteName"
      }
"""
@get('/satellites/<sattellite_id>')
def satellite(sattellite_id):
    
    model = get_ground_station()
    all_satellites = model.all_satellites()
    
    if sattellite_id in [x.id for x in all_satellites ]: 
        return satellite2dict([x for x in all_satellites if x.id == sattellite_id ][0], model.orekit) 
    else:
        abort(404, {"error":"Satellite not found", "id":sattellite_id}) 


"""
  @api {post} /satellites POST /satellites 
  @apiDescription adds a satellite update
  @apiName update satellite 
  @apiGroup Satellites 

  @apiParam {String} seed    Source of the satellite update
  @apiParam {String} updates    String containing satellite updates. Must be deserialized to a json format to obtain SatelliteUpdate objects
 
  @apiParamExample {json} Post Data example
  {
      seed:"aGroundStation",
      updates: '[{satellite_identifier:"24455",ground_station_source:"aGroundStation",lat:"-54",...},...]'
  }
  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK    
             
      
  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "NonExistentSatellite"
        "name":"aNonExistentSatelliteName"
      }
"""
@post('/satellites')
def satellite_updates(): 
    model = get_ground_station() 
    seed = request.forms.seed
    
    updates = json.loads(request.forms.updates)
    
    for update_dict in updates:
        update = SatelliteUpdate(update_dict["satellite_identifier"], update_dict["ground_station_source"])        
        update.__dict__.update(update_dict)
        import datetime
        update.received_time = datetime.datetime.strptime(update.received_time, "%Y-%m-%d %H:%M:%S.%f")
        
        model.process_update(update)
    
    call_listeners(model.message_listeners, "satellite_updates", {"seed":seed, "satellite":satellite})

"""
  @api {get} /satellites/:id/ground_stations GET /satellites/:id/ground_stations   
  @apiName request satellite groundstations
  @apiGroup Satellites 
  @apiDescription Returns the Grounds stations that can/may see the selected satellite in a given date/time

  @apiParam {String} id                      Satellite NORAD assigned number
  @apiParam {String} [start=Current time]    QueryString. date-time (in xxx format), since when the stations were/will be/are visible
  @apiParam {String} [online=false]          QueryString.If set to true, only the Ground station recibing data from the selected satellite will be return. Otherwise the satellite predictions will be used.
  
 
  @apiSuccess {Boolean} traceable  if at least one ground station can receibe data directly from the satellite.
  @apiSuccess {GroundStation[]}  data  Ground Stations that can recibe data from the satellite
  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        {
          "data":[
              { "name":"groundeze", "lat":-34.572716 , "lon":-58.538507,"time":"1:58:25 pm PST"},
              { "name":"groundtincho", "lat":-35.572716 , "lon":-59.538507,"time":"1:58:30 pm PST"}],
          "recordsFiltered":2,
          "recordsTotal":2      
        }
        
  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "NonExistentSatellite"
        "name":"aNonExistentSatelliteName"
      }
"""
@get('/satellites/<sattellite_id>/ground_stations')
def satellite_groundstations(sattellite_id):
    model = get_ground_station()    
    log.debug("satellite_groundstations of %s" % sattellite_id)
    
    if model.has_satellite(sattellite_id):
        call_listeners(model.message_listeners , "satellite_groundstations", {"satellite":sattellite_id})
        gss = model.next_stations(sattellite_id)
        return { "traceable":True if gss else False , "ground_stations":[{"endpoint":x._url_endpoint, "name":x.name} for x in gss]}
        
    else:
        abort(404, {"error":"Satellite not found", "id":sattellite_id})      
  
        


"""
  @api {get} /satellites/:id/orbit GET /satellites/:id/orbit     
  @apiName request satellite orbit
  @apiGroup Satellites 
  @apiDescription Returns the predicted orbit  from the selected satellite

  @apiParam {String} id    Satellite NORAD assigned number

  @apiSuccess {LatLon[]} orbit    Array of (latitude,longitude) that descripts the orbit
  @apiSuccess {LatLonImg[]} images    Array of (latitude,longitude,image_url)
  @apiSuccess {String} predictor  program/algorithm used to predict the orbit
  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        {
            predictor: "Orekit",
            orbit: [
            {"lat":17.800794858683,"lon":48.82980561445}, {"lat":25.066597251564,"lon":55.15562161191}, {"lat":31.96092104897,"lon":62.329367484286}, 
            {"lat":38.29536927152,"lon":70.705988253877} ...],
            imagets:[{"lat":17.800794858683,"lon":48.82980561445,img:"resources/images/pepe.png"}]
        }
        
  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "NonExistentSatellite"
        "name":"aNonExistentSatelliteName"
      }
"""
@get('/satellites/:sattellite_id/orbit')
def satellite_orbit(sattellite_id):
    model = get_ground_station()    
    return {"predictor":"orekit",
            "orbit": model.get_satellite_corridors(sattellite_id),
            "images": model.get_N_images(sattellite_id, 12) 
            }        
    
    # abort(404, {"error":"Satellite not found", "id":sattellite_id})  

"""
  @api {get} /satellites/:id/tle GET /satellites/:id/tle 
  @apiName request satellite tle
  @apiGroup Satellites 
  @apiDescription Returns the TLE data from the selected satellite

  @apiParam {String} id    Satellite NORAD assigned number

  @apiSuccess {String} tle  http://spaceflight.nasa.gov/realdata/sightings/SSapplications/Post/JavaSSOP/SSOP_Help/tle_def.html

  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        ISS (ZARYA)
        1 25544U 98067A   13080.79204657  .00024647  00000-0  40606-3 0  4540
        2 25544  51.6478 182.2316 0011718  59.7125  80.2831 15.52100765821132
        
  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "NonExistentSatellite"
        "name":"aNonExistentSatelliteName"
      }
"""
 
"""
  @api {post} /tracks/satellite POST /tracks/satellite
  @apiName add satellite track
  @apiGroup Tracks 
  @apiDescription adds a track to the indicated satellite

  @apiParam {String} satellite    Satellite NORAD assigned number
  @apiParam {String} sender       Ground station name

  @apiSuccess {String} msg    "OK" String

  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        OK
        
  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "NonExistentSatellite"
        "name":"aNonExistentSatelliteName"
      }
"""   
@post('/tracks/satellite')
def follow_satellite(): 
    model = get_ground_station() 
    leech = request.forms.sender
    satellite = request.forms.satellite
    
    if leech == model.name:
        # msg from frontend
        # satellite = request.forms.satellite
        model.track_satellite(satellite, 40) 
    else:
        # remote ground station
        leech_endpoint = request.forms.endpoint
        
        
        model.add_satellite_leech(leech, leech_endpoint, satellite)
    call_listeners(model.message_listeners, "follow_satellite", {"leech":leech})     
    
"""
  @api {get} /tracks/satellite GET /tracks/satellite
  @apiName get satellite tracks
  @apiGroup Tracks 
  @apiDescription gets all the tracked satellite ids

  @apiParam {String} satellite    Satellite NORAD assigned number
  @apiParam {String} sender       Ground station name

  @apiSuccess {String[]} satellites    Array of satellites ids that are thracked by the station
  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        {
        satellites:["24455","24932"]
        }        
  
"""   
@get('/tracks/satellite')
def satellite_tracks(): 
    model = get_ground_station()         
    call_listeners(model.message_listeners, "satellite_tracks", {})
    return {"satellites":[satellite2dict(x) for x in model.all_satellites() if x.tracked] }
    
     

"""
  @api {delete} /tracks/satellite DELETE /tracks/satellite
  @apiName remove satellite track
  @apiGroup Tracks 
  @apiDescription removes the tracking from the indicated satellite

  @apiParam {String} satellite    Satellite NORAD assigned number
  @apiParam {String} sender       Ground station name

  @apiSuccess {String} msg    "OK" String

  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        OK
        
  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "NonExistentSatellite"
        "name":"aNonExistentSatelliteName"
      }
"""  
@delete('/tracks/satellite')
def un_follow_satellite(): 
    model = get_ground_station() 
    leech = request.forms.sender
    satellite = request.forms.satellite
    
    if leech == model.name:
        # msg from frontend
        # satellite = request.forms.satellite
        model.un_track_satellite(satellite) 
    else:
        # remote ground station
        leech_endpoint = request.forms.endpoint
        
        
        model.remove_satellite_leech(leech, leech_endpoint, satellite)
    call_listeners(model.message_listeners, "un_follow_satellite", {"leech":leech})    
   
"""
  @api {post} /tracks/area POST /tracks/area
  @apiName adds an area to track
  @apiGroup Tracks 
  @apiDescription adds a track to the indicated satellite

  @apiParam {String} name     Area name
  @apiParam {LatLon[]} points       points that defines the area

  @apiSuccess {String} id    Area identifier

  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        {
        id:"1564"
        }
        
  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "NonExistentSatellite"
        "name":"aNonExistentSatelliteName"
      }
"""   
@post('/tracks/area')
def follow_area(): 
    model = get_ground_station() 
    leech = request.forms.leech
    area = request.forms.name
    points = json.loads(request.forms.points) 
  
    if leech == model.name or not leech :
        area_tuple = model.add_area(area, points)        
        updates = area_updates(model)
        area_response = {"name":area_tuple[0], "points":area_tuple[1], "grounds":area_tuple[2], "updates":updates}
        return area_response
    else:
        model.add_area_leech(leech, area, points)
        
        
    call_listeners(model.message_listeners, "follow_area", {"name":area, "points":points}) 
    
        
    
"""
  @api {get} /tracks/area GET /tracks/area
  @apiName get area tracks
  @apiGroup Tracks 
  @apiDescription gets all the tracked areas

  @apiParam {String} satellite    Satellite NORAD assigned number
  @apiParam {String} sender       Ground station name

  @apiSuccess {String[]} areas    Array of areas that are being tracked by the station
  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        {
        areas:[{name:"someplace",points:[ {lat:54,lon:66},...],images:["url1.jpg","url2.jpg",...]}]
        }        
  
"""   
@get('/tracks/area')
def area_tracks(): 
    model = get_ground_station()         
    call_listeners(model.message_listeners, "area_tracks", {})
    if model.area:
        area_tuple = model.area   
        updates = area_updates(model)
        area_response = {"name":area_tuple[0], "points":area_tuple[1], "grounds":area_tuple[2], "updates":updates}
        
        return {"areas":[area_response]}
    else:
        return {"areas":[]}
     

"""
  @api {delete} /tracks/area DELETE /tracks/area
  @apiName remove area track
  @apiGroup Tracks 
  @apiDescription removes the tracking from the indicated area

  @apiParam {String} area    name
  @apiParam {String} sender       Ground station name

  @apiSuccess {String} msg    "OK" String

  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        OK
        
  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "NonExistentSatellite"
        "name":"aNonExistentSatelliteName"
      }
"""  
@delete('/tracks/area')
def un_follow_area(): 
    model = get_ground_station() 
#     leech = request.forms.sender
    area = request.forms.area
    '''
    Por ahora, si llego aca es porque quiero borrar la una area que poseo.
    '''
    model.un_track_area() 
    
#     if leech == model.name:
#         # msg from frontend
#         # satellite = request.forms.satellite
#         model.un_track_area(area) 
#     else:
#         # remote ground station
#         leech_endpoint = request.forms.endpoint        
#         model.remove_area_leech(leech, leech_endpoint, area)
#         
#     call_listeners(model.message_listeners, "un_follow_area", {"leech":leech}) 


"""
  @api {delete} /tracks/area/ground_stations GET /tracks/area/ground_stations
  @apiName get groundstations from area track
  @apiGroup Tracks 
  @apiDescription gets the ground_stations in an area

  @apiParam {String} area      Array of points that defines the polygon
  

  @apiSuccess {String[]} ground_stations    Ground stations' name array

  
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
        {
            ground_stations: ["ground1","ground2",...]  
        }        
  
"""  
@get('/tracks/area/ground_stations')
def ground_stations_from_area(): 
    model = get_ground_station() 
    leech = request.forms.sender
    area = json.loads(request.forms.area)
    call_listeners(model.message_listeners, "in_area", {"area":area}) 

    return {"ground_stations":model.gss_in_area(area)}
        
   
@post('/tracks/area/update')
def update_area(): 
    model = get_ground_station() 
    seed = request.forms.seed
    area = request.forms.area
    
    updates = json.loads(request.forms.updates)
    
    for update_dict in updates:
        update = SatelliteUpdate(update_dict["satellite_identifier"], update_dict["ground_station_source"])        
        update.__dict__.update(update_dict)
        import datetime
        update.received_time = datetime.datetime.strptime(update.received_time, "%Y-%m-%d %H:%M:%S.%f")
        update.area = area 
        
        model.process_update(update)
        
    call_listeners(model.message_listeners, "update_area", {"seed":seed, "updates":updates}) 

def init_server(server, model):        
    run(server=server)


'''
el avance por segundo lo calcula, lo sensa o ambas?

http://wheretheiss.at/w/ajax/realtime
{"success":true,
 "data":{"lat":51.294112612512,"lon":-165.89941786922,"alt":"258.65","vel":"17,149.08",
    "footprint":2244189.7543079,"time":"1:58:25 pm PST","darklat":22.445023748313,
    "darklon":31.870505949191,"vis":"D","copyright":"2011-2012, Bill Shupp"}}
'''
