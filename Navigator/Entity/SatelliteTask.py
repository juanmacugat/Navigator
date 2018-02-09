'''
Created on 4 de feb. de 2016

@author: nacho
'''

from peewee import CharField, Model, IntegerField, PrimaryKeyField, Database, \
    ForeignKeyField, DateField

from Navigator.Entity import database_proxy
from Navigator.Entity.SatelliteRequest import SatelliteRequest


# from Navigator.Entity.SatelliteRequest import SatelliteRequest
class SatelliteTask(Model):
    '''
    classdocs
    '''
    id = PrimaryKeyField()
    priority = IntegerField(null=False)
    
    
    class Meta():
        database = database_proxy
        
    
     