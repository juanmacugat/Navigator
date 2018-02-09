'''
Created on 11 de ene. de 2016

@author: ezequiel
'''
from threading import Lock

class TrakingRequest(object):
    '''
    classdocs
    '''


    def __init__(self, satellite):
        '''
        Constructor
        '''        
        self.satellite = satellite
        self.providers = []
        self.requestors = []
        
        self.lock = Lock()
    
    def add_provider(self,satPass):
        with self.lock:
            self.providers.append(satPass.ground_station)        
        satPass.ground_station.track_satellite(satPass,self.requestors)
    
    def remove_requestor(self,node):
        with self.lock:
            self.requestors.remove(node)
        
    def remove_provider(self,ground_station):
        with self.lock:
            self.providers.remove(ground_station)
    
        
    
        