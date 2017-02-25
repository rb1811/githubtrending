import json 

g = open ('firsthalf_pretty.json','r')
obj1 = json.load(g)

print "Number of keys in firsthalf = ", len(obj1['languages'].keys())


h= open('final.json','w')
h.write(json.dumps(obj1))
h.close()

h= open('final.json','r')
obj3 = json.load(h)

print "NUmber of keys in the final json after copying Firsthalf in fresh json file, This value should come same ", len(obj3['languages'].keys())

f = open('secondhalf_pretty.json','r')
obj2 = json.load(f)

print "Number of keys in secondhalf of the json", len(obj2['languages'].keys())

for key in obj2['languages'].keys():
	if key not in obj3['languages'].keys():
		print "Key is not there so appending ", key
		obj3['languages'][key] = obj2['languages'][key]
	else:
		print "key is there in both files", key
		for project1 in obj2['languages'][key]:
			for project2 in obj3['languages'][key]:
				if project1['project_id'] == project2['project_id']:
					break
			else:
				obj3['languages'][key].append(project2)

print "Number of total keys in the final json ",len(obj3['languages'].keys())

h.close()
g.close()
f.close()