'''
Created on 5 de feb. de 2016

@author: nacho
'''
from peewee import CharField, Model, IntegerField, PrimaryKeyField, Database, \
    ForeignKeyField, DateField

from Navigator.Entity import database_proxy
import peewee


class SatelliteUser(Model):
    '''
    classdocs
    '''
    id = PrimaryKeyField()
    name = CharField(null=False)
    psword = CharField(null=False)
    
    class Meta():
        database = database_proxy
