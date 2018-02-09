'''
Created on 11 de ene. de 2016

@author: ezequiel
'''
from SpaceAi.Task import Task

class UpdateTrackingsTask(Task):
    '''
    classdocs
    '''


    def __init__(self,trackingScheduler):
        '''
        Constructor
        '''
        self.requests = []
        self.trackingScheduler = trackingScheduler
        
    
    def excecute(self):        
        self.trackingScheduler.schedule(self.next_event())
        
        
        
        