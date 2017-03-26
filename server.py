from flask import Flask, jsonify,make_response,render_template, url_for
import sqlite3
from flask import request
from flask_cors import CORS, cross_origin
import json

gitscrapy = Flask(__name__)
cors = CORS(gitscrapy, resources={"/server": {"origins": "*"}})
gitscrapy.config['CORS_HEADERS'] = 'Content-Type'

@gitscrapy.route('/')
@gitscrapy.route('/languages')
def openlanguages():	
	return render_template('languages.html')

@gitscrapy.route('/developers')
def opendevelopers():	
	return render_template('developers.html')


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
		for i in range(len(temp_rows)):
			current_company = temp_rows[i][0]
			current_company_lang =  temp_rows[i][1]
			if current_company not in rows:
				rows[current_company] = {}
				if current_company_lang not in rows[current_company]:
					rows[current_company][current_company_lang] = []
					rows[current_company][current_company_lang].append( {"name":temp_rows[i][2].encode('ascii','ignore'),"forks":temp_rows[i][3],"stars":temp_rows[i][4],"contributing_auth":temp_rows[i][5],"start_time":temp_rows[i][6].encode('ascii','ignore'),"updated_time":temp_rows[i][7].encode('ascii','ignore')}  )
				else:
					rows[current_company][current_company_lang].append( {"name":temp_rows[i][2].encode('ascii','ignore'),"forks":temp_rows[i][3],"stars":temp_rows[i][4],"contributing_auth":temp_rows[i][5],"start_time":temp_rows[i][6].encode('ascii','ignore'),"updated_time":temp_rows[i][7].encode('ascii','ignore')}  )
			else:
				if current_company_lang not in rows[current_company]:
					rows[current_company][current_company_lang] = []
					rows[current_company][current_company_lang].append( {"name":temp_rows[i][2].encode('ascii','ignore'),"forks":temp_rows[i][3],"stars":temp_rows[i][4],"contributing_auth":temp_rows[i][5],"start_time":temp_rows[i][6].encode('ascii','ignore'),"updated_time":temp_rows[i][7].encode('ascii','ignore')}  )
				else:	
					rows[current_company][current_company_lang].append( {"name":temp_rows[i][2].encode('ascii','ignore'),"forks":temp_rows[i][3],"stars":temp_rows[i][4],"contributing_auth":temp_rows[i][5],"start_time":temp_rows[i][6].encode('ascii','ignore'),"updated_time":temp_rows[i][7].encode('ascii','ignore')}  )

		final_rows = {"name":"Github Developers", "children" : []}
		for comp_key in rows.keys():
			temp_dict =  {"name": comp_key.encode('ascii','ignore'), "children":[]}
			for lang_key in rows[comp_key].keys():
				temp_dict2 = {"name": lang_key.encode('ascii','ignore'), "children": []}
				for i in range(len(rows[comp_key][lang_key])):
					temp_dict2["children"].append(rows[comp_key][lang_key][i])
				temp_dict["children"].append(temp_dict2)
			final_rows["children"].append(temp_dict)


		return make_response(jsonify({'data':str(final_rows)}),200)  

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

	elif request.json['title'].encode('ascii','unicode').strip() == 'comp_list':
		conn = sqlite3.connect('github.db')
		print "Database connection success"
		cur = conn.cursor()
		sql =  'select distinct organ from developers;'
		cur.execute(sql)
		temp_rows = cur.fetchall();
		conn.close()
		return make_response(jsonify({'data':temp_rows}),200)  

	elif request.json['title'].encode('ascii','unicode').strip() == 'twocompanies':
		conn = sqlite3.connect('github.db')
		print "Database connection success"
		cur = conn.cursor()
		company1 = request.json['company1'].encode('ascii','ignore')
		company2 = request.json['company2'].encode('ascii','ignore')
		sql =  'select organ,language, count(*) from developers where organ = "'+company1 +'" or organ = "'+company2+'" group by organ, language'
		cur.execute(sql)
		temp_rows = cur.fetchall();
		conn.close()
		rows= {}
		for i in range(len(temp_rows)):
			if temp_rows[i][1] not in rows:
				rows[temp_rows[i][1].encode('ascii','ignore')] = []
				rows[temp_rows[i][1].encode('ascii','ignore')].append( [temp_rows[i][0].encode('ascii','ignore'),temp_rows[i][2]] )
			else: 
				rows[temp_rows[i][1].encode('ascii','ignore')].append( [temp_rows[i][0].encode('ascii','ignore'),temp_rows[i][2]] )
		print rows
		final_rows = []
		for key in rows.keys():
			temp_dict = {}
			temp_dict = {"languages": key}
			if len(rows[key]) == 2:
				temp_dict[rows[key][0][0]] = rows[key][0][1]
				temp_dict[rows[key][1][0]] = rows[key][1][1]
			else:
				if rows[key][0][0] ==  company1:
					temp_dict[company2] = 0
					temp_dict[company1] = rows[key][0][1] 
				else: 
					temp_dict[company1] = 0
					temp_dict[company2] = rows[key][0][1]
			final_rows.append(temp_dict)		
		print final_rows
		return make_response(jsonify({'data':final_rows}),200)

	elif request.json['title'].encode('ascii','unicode').strip() == 'dashboard':
		conn = sqlite3.connect('github.db')
		print "Database connection success"
		cur = conn.cursor()
		language = request.json['lang']
		sql =  'select project_id, project_name,stars,forks,owner_type,contributing_auth, start_time, updated_time organ from languages where  language ="'+ language+'";'
		print sql
		cur.execute(sql)
		temp_rows = cur.fetchall();
		conn.close()
		final_rows= []
		for i in range(len(temp_rows)):
			temp_dict = {language:'', 'stats':{}}
			temp_dict[language] = temp_rows[i][1]
			temp_dict['stats']['stars'] = temp_rows[i][2]
			temp_dict['stats']['forks'] = temp_rows[i][3]
			temp_dict['stats']['owner_type'] = temp_rows[i][4]
			temp_dict['stats']['contrib_auth'] = temp_rows[i][5]
			temp_dict['stats']['start_time'] = temp_rows[i][6]
			temp_dict['stats']['end_time'] = temp_rows[i][7]
			temp_dict['stats']['project_id'] = temp_rows[i][0]
			final_rows.append(temp_dict)
		print final_rows
		return make_response(jsonify({'data':final_rows}),200) 
	else:
		return make_response(jsonify({'error': 'Bad Request'}), 400)

if __name__ == '__main__':
	gitscrapy.run(debug = True)