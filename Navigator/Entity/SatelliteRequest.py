'''
Created on 4 de feb. de 2016

@author: nacho
'''




from peewee import CharField, Model, IntegerField, PrimaryKeyField, Database, \
    ForeignKeyField, DateField
import peewee

from Navigator.Entity import database_proxy
from Navigator.Entity.SatelliteService import SatelliteService


class SatelliteRequest(Model):
    '''
    classdocs
    '''
    id = PrimaryKeyField()
    traker = CharField(null=False)
    satellite_services_id = ForeignKeyField(SatelliteService,null=False,related_name="satelliteservices")
    date = DateField(null=False)
    state = CharField(null=False)
    
 
    
    class Meta():
        database = database_proxy