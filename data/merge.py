# -*- coding: utf-8 -*-
import sys
import json, io
from fuzzywuzzy import fuzz
from fuzzywuzzy import process

print sys.stdout.encoding

with open('allteamdata.json') as data_file:
	allteamdata = json.loads(data_file.read().decode('utf-8'))

with open('teams.json') as data_file:
	teams = json.loads(data_file.read().decode('utf-8'))

j = 0
i = 0
mergeCount = 0
while (i < range(len(allteamdata))):
	# print j
	# print i
	if (i == 78):
		break
	if (j == 78):
		print("NOT SWAPPED: {}").format(allteamdata[i]['name'].encode('utf-8'))
		j = 0
		i += 1
	elif (fuzz.ratio(allteamdata[i]['name'].encode('utf-8'), teams[j]['name'].encode('utf-8')) > 75):
		# print('MERGED:')
		# print("Old: {}").format(allteamdata[i]['name'].encode('utf-8'))
		# print("New: {}").format(teams[j]['name'].encode('utf-8'))
		allteamdata[i]['name'] = teams[j]['name']
		j = 0
		i += 1
		mergeCount += 1
	else:
		j += 1

with io.open('mergedCombined.json', 'w', encoding='utf-8') as f:
	f.write(json.dumps(allteamdata, indent=4, sort_keys=True, ensure_ascii=False))

print("Merge Count: {}").format(mergeCount)