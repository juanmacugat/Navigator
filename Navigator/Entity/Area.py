'''
Created on 2 de mar. de 2016

@author: nacho
'''

from peewee import CharField, Model, IntegerField, PrimaryKeyField, Database,\
    ForeignKeyField

from Navigator.Entity import database_proxy


class Area(Model):
    '''
    classdocs
    '''
    
    id = PrimaryKeyField()
    category = CharField()
    
    

    class Meta():
        database = database_proxy