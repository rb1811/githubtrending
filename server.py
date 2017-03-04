from flask import Flask, jsonify,make_response
import sqlite3
from flask import request

gitscrapy = Flask(__name__)

@gitscrapy.route('/server', methods=['POST'])
def call_server():
	
	if not request.json or not 'title' in request.json:
		return make_response(jsonify({'error': 'Request body Not found'}), 404)
	elif request.json['title'].encode('ascii','unicode').strip() == 'languages':
		conn = sqlite3.connect('github.db')
		cur = conn.cursor()
		sql =  'select LANGUAGE, count(*) from languages group by LANGUAGE'
		cur.execute(sql)
		rows= cur.fetchall();
		conn.close()
		return make_response(jsonify({'data':rows}),200) 
	else:
		return make_response(jsonify({'error': ' Request body key not proper'}), 404)

if __name__ == '__main__':
	gitscrapy.run(debug = True)
