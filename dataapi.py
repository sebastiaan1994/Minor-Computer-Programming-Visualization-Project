import json, io, httplib, teamid

datateams = []

for i in range(len(teamid.teams)):
	connection = httplib.HTTPConnection('api.football-api.com')
	headers = { 'X-Auth-Token': '7aa26243647748ec8c219e5ec65a8179', 'X-Response-Control': 'minified' }
	connection.request('GET', '/2.0/team/'+teamid.teams[i]+'?Authorization=565ec012251f932ea40000018dd424a6bbb14f3742145f5294b17efc', None, headers )
	data = json.loads(connection.getresponse().read().decode('utf-8'))
	datateams.append(data)

print datateams

with io.open('allteaamdata.json', 'w', encoding='utf-8') as f:
	f.write(json.dumps(datateams, indent=4, sort_keys=True, ensure_ascii=False))