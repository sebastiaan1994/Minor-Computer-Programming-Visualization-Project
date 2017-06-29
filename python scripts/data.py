import json, io, httplib

connection = httplib.HTTPConnection('api.football-data.org')
headers = { 'X-Auth-Token': '7aa26243647748ec8c219e5ec65a8179', 'X-Response-Control': 'minified' }
connection.request('GET', '/v1/teams/66', None, headers )
data = json.loads(connection.getresponse().read().decode('utf-8'))

print data