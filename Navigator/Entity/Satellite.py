'''
Created on 3 de feb. de 2016

@author: nacho
'''
from peewee import CharField, Model, IntegerField, PrimaryKeyField, Database

from Navigator.Entity import database_proxy


class Satellite(Model):
    '''
    classdocs
    '''
    
    id = PrimaryKeyField()
    tle1 = CharField()
    tle2 = CharField()
    norad = CharField()
    name = CharField()
    

    class Meta():
        database = database_proxy

    @staticmethod
    def by_norad_id(norad):
        from Navigator.Entity.SatelliteService import SatelliteService
        return Satellite(norad=norad,tle1="",tle2="",name="",services=[SatelliteService(frequency=95100000)])
    
    
    