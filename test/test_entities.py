'''
Created on 3 de feb. de 2016

@author: nacho
'''

from datetime import date
import unittest

from peewee import MySQLDatabase

import Navigator
from Navigator.Entity import database_proxy, SatelliteRequest, SatelliteService, Satellite, SatelliteTask, SatelliteUser
from Navigator.Entity.Satellite import Satellite
from Navigator.Entity.SatelliteRequest import SatelliteRequest
from Navigator.Entity.SatelliteRequestTask import SatelliteRequestTask
from Navigator.Entity.SatelliteResource import SatelliteResource
from Navigator.Entity.SatelliteService import SatelliteService
from Navigator.Entity.SatelliteTask import SatelliteTask
from Navigator.Entity.SatelliteUser import SatelliteUser
from Navigator.Entity.Tracking import Tracking
from Navigator.Entity.Area import Area
from Navigator.Entity.Point import Point
from __builtin__ import len


# from Navigator.Entity import SatelliteRequest, SatelliteService, Satellite, \
#     database_proxy
class Test(unittest.TestCase):


    def setUp(self):
        self.db = MySQLDatabase("SpaceAITests",passwd="serafo",user="root")
       
        database_proxy.initialize(self.db)
        for entidad in [Point, Area,Tracking,SatelliteResource,SatelliteRequestTask,SatelliteTask,SatelliteUser,SatelliteRequest,SatelliteService,Satellite]:
            if entidad.table_exists():
                entidad.drop_table()
        for entidad in [Satellite,SatelliteService,SatelliteRequest,SatelliteUser,SatelliteTask,SatelliteRequestTask,SatelliteResource,Tracking,Area,Point]:
            entidad.create_table()
            

    def tearDown(self):
        self.db.close()

 
    def test_Satellite_Entity(self):
        nora ="asdasd"
        sate =  Satellite(norad= nora,tle1 ="2akjsdbfk",tle2 = "afasd")
        sate.save()
        sate2 = Satellite.get(Satellite.norad == nora)
        print sate2.norad
  
      
    def test_SatelliteService_Entity(self):
        nora ="asdasd"
        sate =  Satellite(norad= nora,tle1 ="2akjsdbfk",tle2 = "afasd")
        sate.save()
            
        service1 = SatelliteService(name="unSatelite",frequency="1234",category="apt",satellite_id = sate.id)
        service1.save() 
        print len(sate.services)
#         
    def test_SatelliteRequest(self):
           
        nora ="asdasd"
        sate =  Satellite(norad= nora,tle1 ="2akjsdbfk",tle2 = "afasd",name="careta")
        sate.save()
           
        service1 = SatelliteService(name="otroSatellite",frequency="345",category="apt",satellite_id = sate.id)
        service1.save()
           
        satRequest = SatelliteRequest(traker="enfermito",satellite_services_id = service1.id, date= date(1990,1,15),state="atendido") 
        satRequest.save()
   
        print sate.id
        print service1.id  
        print satRequest.id
      
    def test_entities_SateliteTask(self):
           
        nora ="asdasd"
        sate =  Satellite(norad= nora,tle1 ="2akjsdbfk",tle2 = "afasd",name="careta")
        sate.save()
            
        service1 = SatelliteService(name="otroSatellite",frequency="345",category="apt",satellite_id = sate.id)
        service1.save()
            
        satRequest = SatelliteRequest(traker="enfermito",satellite_services_id = service1.id, date= date(1990,1,15),state="atendido") 
        satRequest.save()
        
        satRequest2 = SatelliteRequest(traker="enfermito2",satellite_services_id = service1.id, date= date(1990,1,15),state="atendido") 
        satRequest2.save()
                  
        task = SatelliteTask(priority = 123)
        task.save()
        
        request_task = SatelliteRequestTask(request_id = satRequest.id,task_id = task.id)
        request_task.save()
        
        request_task2 = SatelliteRequestTask(request_id = satRequest2.id,task_id = task.id)
        request_task2.save()
        
        
        rq  = SatelliteRequest.get(SatelliteRequest.id == satRequest.id)
        
        task2 = SatelliteTask.get(SatelliteTask.id == task.id)
        
        
        
        
        print "Tabla Intermedia:"
        print  request_task.request_id
        print request_task.task_id
        
        print "Tareas del pedido:"
        print len(rq.tasks)
        
        print "pedidos de la tarea:"
        print len(task2.requests)
        
        
        
        
          
     
    def test_entities_user(self):
        u = SatelliteUser()
        u.name="enfermito"
        u.psword ="asdas"
        u.save()
      
        user2 = SatelliteUser.get(SatelliteUser.id == u.id)
          
        print user2.name
        
    def test_entities_satellite_resource(self):
        
        satelite =  Satellite(norad= "pruebaNora",tle1 ="2akjsdbfk",tle2 = "afasd")
        satelite.save()
            
        servicio = SatelliteService(name="servicioSatelital",frequency="1234",category="apt",satellite_id = satelite.id)
        servicio.save() 
        
    
        satResource = SatelliteResource(satellite_id = satelite.id, satellite_service_id = servicio.id, date= date(1990,1,15),link="http://www.sarasa/resource",path="/resource/",position="asdfghj")
        satResource.save()
        
        print satResource.id
        print satResource.path
     
    def test_entities_satellite_Tracking(self):    
        
        satelite =  Satellite(norad= "pruebaNora",tle1 ="2akjsdbfk",tle2 = "afasd")
        satelite.save()
        
        trk = Tracking(satellite_id = satelite.id,start=date(1992,4,17),end = date(2001,2,23),status ="unEstado")
        trk.save()
        
        print trk.id
        print trk.satellite_id
        print trk.start
        print trk.end
        print trk.status
        
    def test_entities_area(self):    
        
        area =  Area(category="unaCategoria")
        area.save()
        
        p1 = Point(latitude="12.1234",longitude="12.1233",area_id = area.id)
        p1.save()
        p2 = Point(latitude="12.1234",longitude="12.1233",area_id = area.id)
        p2.save()
        
        
        a2 = Area.get(Area.id == area.id)
        
        print len(a2.points)
        print a2.category
        print a2.points[1].latitude
        a2.points.pop(1)
        print len(a2.points)
        
        
        
      
        
#     satellite_id = ForeignKeyField(Satellite)
#     start = DateField(null=False)
#     end = DateField(null=False)
#     status = CharField(null =False)
        
        
if __name__ == "__main__":
#     import sys;sys.argv = ['', 'Test.test_Satellite_Entity_']
    unittest.main()