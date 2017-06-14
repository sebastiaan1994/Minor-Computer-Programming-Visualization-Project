import json

with open('PL.json') as json_data:
    d = json.load(json_data)

with open('SerieA.json') as json_data:
    e = json.load(json_data)

with open('laliga.json') as json_data:
    f = json.load(json_data)

with open('bundesliga.json') as json_data:
    g = json.load(json_data)

team_ids = []

for i in range(len(d)):
	team_ids.append(d[i]['team_id'])

for i in range(len(e)):
	team_ids.append(e[i]['team_id'])

for i in range(len(f)):
	team_ids.append(f[i]['team_id'])

for i in range(len(g)):
	team_ids.append(g[i]['team_id'])

teams = team_ids

