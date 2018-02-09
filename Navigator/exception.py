'''
Created on Dec 2, 2015

@author: eze
'''

class SatelliteNotFoundException(Exception):
    '''
    classdocs
    '''


    def __init__(self, satellite_name):
        '''
        Constructor
        '''
        self.satellite_name = satellite_name