from flask import Flask, jsonify,make_response
import sqlite3
from flask import request
from flask_cors import CORS, cross_origin

gitscrapy = Flask(__name__)
cors = CORS(gitscrapy, resources={"/server": {"origins": "*"}})
gitscrapy.config['CORS_HEADERS'] = 'Content-Type'

@gitscrapy.route('/server', methods=['POST'])
def call_server():
	if not request.json or not 'title' in request.json:
		return make_response(jsonify({'error': 'Request body Not foundy'}), 404)
	if request.json['title'].encode('ascii','unicode').strip() == 'languages':
		conn = sqlite3.connect('github.db')
		print "Connection to db success"
		cur = conn.cursor()
		sql =  'select LANGUAGE, count(*) from languages group by LANGUAGE'
		cur.execute(sql)
		rows= cur.fetchall();
		conn.close()
		return make_response(jsonify({'data':rows}),200) 

	elif request.json['title'].encode('ascii','unicode').strip() == 'developers':
		conn = sqlite3.connect('github.db')
		print "Database connection success"
		cur = conn.cursor()
		sql =  'select organ,LANGUAGE, PROJECT_NAME,FORKS,STARS,CONTRIBUTING_AUTH,START_TIME,UPDATED_TIME from developers order by organ,LANGUAGE ASC'
		cur.execute(sql)
		temp_rows = cur.fetchall()
		conn.close()
		rows={}
		keys= ['project_name','forks','stars','contributing_auth','start_time','updated_time']
		for i in range(len(temp_rows)):
			current_company = temp_rows[i][0]
			current_company_lang =  temp_rows[i][1]
			if current_company not in rows:
				rows[current_company] = {}
				if current_company_lang not in rows[current_company]:
					rows[current_company][current_company_lang] = []
					rows[current_company][current_company_lang].append(  dict(zip(keys,temp_rows[i][2:]))  )
				else:	
					rows[current_company][current_company_lang].append(  dict(zip(keys,temp_rows[i][2:]))  )
			else:
				if current_company_lang not in rows[current_company]:
					rows[current_company][current_company_lang] = []
					rows[current_company][current_company_lang].append(  dict(zip(keys,temp_rows[i][2:]))  )
				else:	
					rows[current_company][current_company_lang].append(  dict(zip(keys,temp_rows[i][2:]))  )

		return make_response(jsonify({'data':rows}),200) 

	elif request.json['title'].encode('ascii','unicode').strip() == 'dev_comp':
		conn = sqlite3.connect('github.db')
		print "Database connection success"
		cur = conn.cursor()
		sql =  'select organ, language, count(*) from developers group by organ,language'
		cur.execute(sql)
		temp_rows = cur.fetchall();
		conn.close()
		rows = {}
		for i in range(len(temp_rows)):
			current_company  =  temp_rows[i][0]
			current_company_lang  =  temp_rows[i][1]
			if current_company not in rows:
				rows[current_company] = {}
				if current_company_lang not in rows[current_company]:
					rows[current_company][current_company_lang] = temp_rows[i][2]
				else:	
					rows[current_company][current_company_lang] = temp_rows[i][2]
			else:
				if current_company_lang not in rows[current_company]:
					rows[current_company][current_company_lang] = temp_rows[i][2]
				else:	
					rows[current_company][current_company_lang] = temp_rows[i][2]

		return make_response(jsonify({'data':rows}),200) 
	else:
		return make_response(jsonify({'error': 'Bad Request'}), 400)

if __name__ == '__main__':
	gitscrapy.run(debug = True)
