# -*- coding: utf-8 -*-
import sys
import json, io
from fuzzywuzzy import fuzz
from fuzzywuzzy import process

print sys.stdout.encoding

with open('leagues.json') as data_file:
	leagues = json.loads(data_file.read().decode('utf-8'))

with open('stadium.json') as data_file:
	stadium = json.loads(data_file.read().decode('utf-8'))

j = 0
i = 0

while (i < range(len(leagues))):
	print j
	print i
	if (i == 78):
		break
	if (j == 78):
		j = 0
		i += 1
	elif (fuzz.ratio(leagues[i]['name'].encode('utf-8'), stadium[j]['clubLabel'].encode('utf-8')) > 60):
		print('MERGED:')
		leagues[i]['league'] = stadium[j]['league']
		leagues[i]['stadium'] = stadium[j]['venueLabel']
		leagues[i]['longitude'] = stadium[j]['longitude']
		leagues[i]['latitude'] = stadium[j]['latitude']
		j = 0
		i += 1
	else:
		j += 1

with io.open('combined.json', 'w', encoding='utf-8') as f:
	f.write(json.dumps(leagues, indent=4, sort_keys=True, ensure_ascii=False))