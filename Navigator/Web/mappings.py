'''
Created on Feb 7, 2015

@author: eze
'''


import datetime

def station2dict(station):
    return  { "name":station.name, "endpoint":station.myendpoint(),
             "lat":station.position.lat , "lon":station.position.lon,
             "alt" : 888,   "uct" : "16599",
             "images": {"source":"sat1","lat":"-31","lon":"-54",
                "url":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTzrGs1p9DiXyuciCI-y1rsJP6X1I09GLZQsnAOpnpYiEkSmFPlcot_jUCE"},
             "satellites" : ["noaa-1","iss","cubesat-123"],
             "next_satellites" : ["noaa-2","capitan-beto"],
             "capabilities": ["satellite_traking","satellite_date_relay"],
             "traking_satellites" : ["noaa-1","noaa-3"],
             "leeching" : [{"seed":"ground3", "resource": "noaa-3" }],
             "seeding" : [{"leech":"ground2", "resource": "iss" }],
             "last_update":station.last_update.strftime('%X %x %Z') }

def satellite2dict(satellite,predictor=None):
    
    last_received_update = satellite.last_update().received_time
    attr = satellite.attributes(predictor)
    return  {
    "name": satellite.name,
    "id": satellite.id,
    "lat": attr.lat,
    "lon": attr.lon,
    "altitude": satellite.attributes().altitude,
    "velocity": satellite.attributes().velocity,
    "footprint": satellite.attributes().footprint,
    "timestamp": (last_received_update - datetime.datetime(1970, 1, 1)).total_seconds(),
    "daynum": satellite.attributes().daynum,
    "last_update": last_received_update.strftime('%X %x %Z'), 
    "source":  satellite.last_update().ground_station_source, 
    "status":  str(satellite.status()), #str(random.sample(list(SATELLITE_STATUS),1)[0])
    "tle":satellite.get_tle()
    }

def satelliteUpdate2dict(satUpdate):
    pepe = satUpdate.__dict__
    dict_update = {}
    dict_update.update(pepe) 
    dict_update["received_time"] = str(dict_update["received_time"])     
    return dict_update