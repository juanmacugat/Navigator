'''
Created on 12 de ene. de 2016

@author: ezequiel
'''

class TrackingScheduler(object):
    '''
    classdocs
    '''


    def __init__(self, satPassesProvider):
        '''
        Constructor
        '''
        self.satPassesProvider = satPassesProvider
        self.requests = []
        
    def schedule(self,until):
        self.satPassesProvider.updatePasses(until)
        for request in self.requests:
            sat_passes = self.satPassesProvider.passes(request.sat)            
            for sat_pass in sat_passes:
                if sat_pass.ground_station not in request.provider:
                    request.handle(sat_pass)
        
                    
                    
        
        
        
        
        