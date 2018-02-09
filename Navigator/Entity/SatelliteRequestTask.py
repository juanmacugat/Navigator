'''
Created on 8 de feb. de 2016

@author: nacho
'''
from peewee import Model, ForeignKeyField

from Navigator.Entity import database_proxy
from Navigator.Entity.SatelliteRequest import SatelliteRequest
from Navigator.Entity.SatelliteTask import SatelliteTask


class SatelliteRequestTask(Model):
    '''
    classdocs
    '''
    request_id = ForeignKeyField(SatelliteRequest,null=False, related_name='tasks')
    task_id = ForeignKeyField(SatelliteTask,null=False, related_name='requests')

    class Meta():
        database = database_proxy
        