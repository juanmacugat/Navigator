'''
Created on 30 de ene. de 2016

@author: ezequiel
'''
import unittest

from peewee import SqliteDatabase

from Navigator.Task.SatelliteTrackTask import SatelliteTrackTask
from SpaceAi import Struct
from SpaceAi.App.AppManager import AppManager
from SpaceAi.Scheduler.Scheduler import  InmediateScheduler, Scheduler
from SpaceAi.App.LocationManager import FixedPos, Position
from SpaceAi.Scheduler.Resource import Antenna
from SpaceAi.Gateway.SDRInterface import SDRInterface
from datetime import datetime, timedelta


class TestEscucha(unittest.TestCase):
    '''
    Yo soy la GS que recibe el pedido (generado por el HUB) y lo tengo que reenviar (el resultado de la escucha) algun o a varios terceros
    Este va a serr el metodo que recibe un pedido de Tackeo.
    Hay que calcular las pasadas, en funcion de las pasadas
    agendar los momentos de escucha.
    Finalmente cuando llegue el momento grabar FM

    Para la primer prueba:
     El scheduler ejecuta la tarea en el momento, no se planifica
     La duracion de la pasada es 10 segundos
     Grabamos FM
     Se reproduce el audio al final del test

    '''
    

    def setUp(self):
        pass


    def tearDown(self):
        pass


    def testName(self):
        am = AppManager(apps_dir="../")
        
        antenna = Antenna(SDRInterface()) 
        am.scheduler = Scheduler([antenna])
        
        am.task_manager = InmediateScheduler(antenna)
        am.db = SqliteDatabase('test.db')
        am.location_manager = FixedPos()
        am.location_manager.set_pos(Position(10, 10))
        app = Struct(name="Navigator",
                     main_module= "Navigator.NavigatorApp") 
        am.add_app(app) 
        nav = am.apps[0]
        
        one_pass = Struct(startDate=datetime.now(),endDate=datetime.now() + timedelta(seconds=10))
        nav.simorb = Struct(getPasses= lambda tle, start, stop, lat, lon : [one_pass]  )
        
        
        nav.satellite_track_task("25544",8,["pepe"])
        
        
        
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    


if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()