import sqlite3
import json
conn = sqlite3.connect('github.db')
print "Opened database successfully";
f = open ('final.json','r')
obj= json.load(f)
for key in obj['languages'].keys():
	for i in range(len(obj['languages'][key])):
		project_id = obj['languages'][key][i]['project_id']
		
		title=obj['languages'][key][i]['project_name'].split('/')
		project_name=  title[0]+' '+title[1]
		
		stars=obj['languages'][key][i]['stargazers']
		forks=obj['languages'][key][i]['forks_count']
		language = key
		owner_type = obj['languages'][key][i]['owner_type']
		contrib_auth = obj['languages'][key][i]['contrib_authors']
		
		s_time = obj['languages'][key][i]['start_time']
		u_time = obj['languages'][key][i]['updated_time']
		start_time= s_time[:s_time.find('T')]
		update_time=u_time[:u_time.find('T')]

		if conn.execute( 'INSERT INTO LANGUAGES(PROJECT_ID,PROJECT_NAME,LANGUAGE,OWNER_TYPE,FORKS,STARS,CONTRIBUTING_AUTH,START_TIME,UPDATED_TIME) VALUES (?,?,?,?,?,?,?,?,?)', [project_id,project_name,language,owner_type,forks,stars,contrib_auth,start_time,update_time]):
			print "Success"
			conn.commit()
		else:
			print "error"
			print  obj['languages'][key]['project_id']
			break