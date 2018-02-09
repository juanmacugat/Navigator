'''
Created on 2 de mar. de 2016

@author: nacho
'''

from peewee import CharField, Model, IntegerField, PrimaryKeyField, Database,\
    ForeignKeyField

from Navigator.Entity import database_proxy
from Navigator.Entity.Area import Area


class Point(Model):
    '''
    classdocs
    '''
    
    id = PrimaryKeyField()
    latitude = CharField()
    longitude = CharField()
    area_id = ForeignKeyField(Area,null=False,related_name="points")
    

    class Meta():
        database = database_proxy