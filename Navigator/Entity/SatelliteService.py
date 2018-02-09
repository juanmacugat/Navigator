'''
Created on 3 de feb. de 2016

@author: nacho
'''

from peewee import CharField, Model, IntegerField, PrimaryKeyField, Database, \
    ForeignKeyField

from Navigator.Entity import database_proxy
from Navigator.Entity.Satellite import Satellite
from SpaceAi import Struct


class SatelliteService(Model):
    '''
    classdocs
    '''
    
    id = PrimaryKeyField()
    name = CharField(null=False)
    frequency = IntegerField(null=False)
    category = CharField(null=False)
    satellite_id = ForeignKeyField(Satellite,null=False,related_name="services")
    
    def parameters(self):
        return Struct(frequency = self.frequency)

    class Meta():
        database = database_proxy
        