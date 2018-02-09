'''
Created on 8 de feb. de 2016

@author: nacho
'''
from peewee import Model, PrimaryKeyField, ForeignKeyField, DateField, CharField
from Navigator.Entity import database_proxy
from Navigator.Entity.Satellite import Satellite
from Navigator.Entity.SatelliteService import SatelliteService


class SatelliteResource(Model):
    '''
    classdocs
    '''
    
    id = PrimaryKeyField()
    satellite_id = ForeignKeyField(Satellite, null=False)
    satellite_service_id = ForeignKeyField(SatelliteService, null=False)
    date  = DateField()
    link = CharField()
    path = CharField()
    position = CharField()
    
    class Meta():
        database = database_proxy
