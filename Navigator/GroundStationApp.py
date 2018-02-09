'''
Created on Dec 2, 2015

@author: eze
'''
from Navigator.ListenSatelliteTask import ListenSatelliteTask
from SpaceAi import Struct
from SpaceAi.App import App
from SpaceAi.Scheduler.Task import Task  
from Navigator.exception import SatelliteNotFoundException


class GroundStationApp(App):
    '''
    classdocs
    '''


    def __init__(self, name,sdn):
        '''
        Constructor
        '''
        super(self.__class__, self).__init__( name,sdn)
        self._simorb = None
    
    def gps(self,gps):
        self._gps = gps
        gps_task = Task()
        self.tasks.append(gps_task)
    
    def coords(self,coords):
        self._gps = Struct(coords=coords)
    
    def start(self):
        '''
        '''
        super(self.__class__, self).start()
        self.load_satellite_data()
        self._load_satellites_to_listen()
    
    def _load_satellites_to_listen(self):
        for satellite_name in self.satellites_to_listen:
            self._listen_satellite(satellite_name)
    
    def listen_satellite(self,satellite_name):
        self.satellites_to_listen.push(satellite_name)
        self._listen_satellite(satellite_name)
    
    def _listen_satellite(self,satellite_name):
        if satellite_name not in self.current_satellites():
            raise SatelliteNotFoundException(satellite_name)
        satellite = self.satellite(satellite_name)        
        self.scheduler.add_task(ListenSatelliteTask(satellite))
    
    