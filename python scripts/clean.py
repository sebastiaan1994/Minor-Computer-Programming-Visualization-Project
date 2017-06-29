import json, io
import csv

with open('allteamdata.json', 'r') as output:
	data = json.load(output)

lists = []
for i in range(len(data)):
	team = data[i]['name']
	country = data[i]['country']
	for j in range(len(data[i]['squad'])):
		player = data[i]['squad'][j]['name']
		minutes = data[i]['squad'][j]['minutes']
		goals = data[i]['squad'][j]['goals']
		age = data[i]['squad'][j]['age']
		position = data[i]['squad'][j]['position']
		yellow = data[i]['squad'][j]['yellowcards']
		red = data[i]['squad'][j]['redcards']
		assists = data[i]['squad'][j]['assists']
		lists.append([team, country, player, minutes, goals, assists, age, position, yellow, red])

lists = [[s.encode('utf8') for s in t] for t in lists]

with io.open('playerdata2.csv', 'wb') as f:
	writer = csv.writer(f)
	writer.writerows(lists)
