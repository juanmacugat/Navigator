'''
Created on 10 de feb. de 2016

@author: nacho
'''
from peewee import Model, PrimaryKeyField, ForeignKeyField, DateField, CharField

from Navigator.Entity import database_proxy
from Navigator.Entity.Satellite import Satellite


class Tracking(Model):
    '''
    classdocs
    '''
    id = PrimaryKeyField()
    satellite_id = ForeignKeyField(Satellite)
    start = DateField(null=False)
    end = DateField(null=False)
    status = CharField(null =False)

    class Meta():
        database = database_proxy
        