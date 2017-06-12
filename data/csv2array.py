import csv
import json

data = []

with open('premierLeague.csv') as f:
    cr=csv.reader(f)
    skip=next(cr)  #skip the first row of keys "a,b,c,d"
    data =  [map(str, l) for l in cr]

f = open('premierLeague.txt', 'w')
json.dump(data, f)
f.close()

print data