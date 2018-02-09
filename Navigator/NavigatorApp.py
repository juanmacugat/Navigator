'''
Created on 8 de feb. de 2016

@author: ezequiel
'''

import datetime

from Navigator.Task.SatelliteTrackTask import SatelliteTrackTask
from Navigator.Web.NavigatorFrontEnd import NavigatorFrontEnd
from SpaceAi import Struct
from SpaceAi.App.App import App

from peewee import MySQLDatabase
from Navigator.Entity import database_proxy, SatelliteRequest, SatelliteService, Satellite, SatelliteTask, SatelliteUser,\
    Point
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


class NavigatorApp(App):
    '''
    classdocs
    '''

    def tasks(self):
        return []
    
    def policies(self):
        return []
    
    def routes(self):   
        return [
                Struct(path="/ground_stations",method="get",callback=self.api.ground_stations ),
                Struct(path="/ground_stations/<name>",method="get",callback=self.api.ground_station ),
                Struct(path="/login",method="post",callback=self.api.login ),
                Struct(path="/",method="get",callback=self.api.home ),
                Struct(path="/user",method="get",callback=self.api.get_user ),
                Struct(path="/logout",method="get",callback=self.api.log_out),
                Struct(path="/select_are",method="get",callback=self.api.select_area),           
                Struct(path="/dashboard",method="get",callback=self.api.dashboard),
                Struct(path="/draw_area",method="get",callback=self.api.draw_area),
                Struct(path="/set_area",method="post",callback=self.api.set_area),
                Struct(path="/get_area",method="get",callback=self.api.get_area)
                ]
    
    def init_db(self,db):
        database_proxy.initialize(db)  # @UndefinedVariable
        for entidad in [Satellite,SatelliteService,SatelliteRequest,SatelliteUser,SatelliteTask,SatelliteRequestTask,SatelliteResource,Tracking,Area,Point]:
            if not entidad.table_exists():
                entidad.create_table()
#         for entidad in [Satellite,SatelliteService,SatelliteRequest,SatelliteUser,SatelliteTask,SatelliteRequestTask,SatelliteResource,Tracking]:
#             entidad.create_table()
    
    def init(self):
        self.api =  NavigatorFrontEnd(self)
        self.satellites = []
        self.stations = []
        self.satellite_dao = Satellite
        self.simorb = None
        #self.ground_station_dao = GroundStation
        
        
    def satellite_passes(self,satellite):        
        listen_start = datetime.datetime.now() 
        listen_stop = datetime.datetime.now() + datetime.timedelta(days=1)
        pos = self.location_manager.get_pos()                        
        return self.simorb.getPasses( satellite.tle1 + "\n" + satellite.tle2, 
                listen_start, listen_stop, pos.lat, pos.lon )
        
    def satellite_track_task(self,norad_id,priority,requestors):
        satellite = self.satellite_dao.by_norad_id(norad_id)
        task = SatelliteTrackTask(satellite,self,priority,requestors)
        passes = self.satellite_passes(satellite)
        task.startDate = passes[0].startDate
        task.endDate = passes[0].endDate
        self.task_manager.add_task(task)
    
    def me(self):
        return Struct(name=self.name,lat=-35,lon=-58)
    
    def all_stations(self):
        return self.stations


 