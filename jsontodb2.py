import sqlite3
import json
conn = sqlite3.connect('github.db')
print "Opened database successfully";
f = open ('final2.json','r')
obj= json.load(f)
for i in range(len(obj)):
	key = obj[i].keys()[0].encode('ascii','encode').strip()
	for j in range(len(obj[i][key])):
		project_id = obj[i][key][j]['project_id'] 
		
		#title=obj['languages'][key][i]['project_name'].split('/')
		project_name= obj[i][key][j]['project_name'] 
		
		stars= obj[i][key][j]['stargazers']
		forks= obj[i][key][j]['forks_count']
		language = obj[i][key][j]['language']
		owner_type =  key
		contrib_auth = obj[i][key][j]['contrib_authors']
		
		s_time = obj[i][key][j]['start_time']
		u_time = obj[i][key][j]['end_time']
		start_time= s_time[:s_time.find('T')]
		update_time=u_time[:u_time.find('T')]

		if conn.execute( 'INSERT INTO DEVELOPERS(PROJECT_ID,PROJECT_NAME,LANGUAGE,ORGAN,FORKS,STARS,CONTRIBUTING_AUTH,START_TIME,UPDATED_TIME) VALUES (?,?,?,?,?,?,?,?,?)', [project_id,project_name,language,owner_type,forks,stars,contrib_auth,start_time,update_time]):
			print "Success"
			conn.commit()
		else:
			print "error"
			print  
			break