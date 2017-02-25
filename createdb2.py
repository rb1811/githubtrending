import sqlite3
conn = sqlite3.connect('github.db')
print "Opened database successfully";
sql = 'CREATE TABLE developers(SRNO INTEGER PRIMARY KEY AUTOINCREMENT,PROJECT_ID INTEGER(20),PROJECT_NAME VARCHAR(500),LANGUAGE CHAR(20),ORGAN CHAR(20),FORKS INTEGER(20),STARS INTEGER(20),CONTRIBUTING_AUTH INTEGER(20),START_TIME CHAR(10),UPDATED_TIME CHAR(10))'
conn.execute(sql)

print "Table created successfully";
conn.close()