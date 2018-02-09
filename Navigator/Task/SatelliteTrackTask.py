'''
Created on Feb 13, 2016

@author: eze
'''
import copy
import datetime

from SpaceAi.Scheduler.Task import Task


class SatelliteTrackTask(Task):
    '''
    classdocs
    '''

    def __init__(self, satellite, app,priority=100,requestors=lambda : []):
        '''
        Constructor
        '''
        self.satellite = satellite
        self.priority=priority
        self.requestors=requestors
        self.app = app
    
    def resources(self):
        return ["sdr"]
        
    def jobToDo(self,resources):        
        sat_params = copy.copy( self.satellite.services[0].parameters())
        sat_params.duration = self.duration()
        resources.listen(sat_params)
    
    def next_event(self):
        sat_passes = self.app.satellite_passes(self.norad_id)
        self.next_pass = self.sat_passes[0]
        return sat_passes[0].datetime
    
    