#!/usr/bin/env python
# Reflects the requests from HTTP methods GET, POST, PUT, and DELETE
# Written by Nathan Hamiel (2010)
# Modified by Marco Mora-Mendoza

from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
from optparse import OptionParser
import sqlite3
from sqlite3 import Error
import json
import datetime

database = r"C:\sqlite\db\BreathingEdgesLog.db"

class RequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        request_path = self.path
        print("\n----- Request Start ----->\n")
        print(request_path)
        print(self.headers)
        print("<----- Request End -----\n")

        if request_path == '/getID':
            self.send_response(200)
            self.send_header('Content-type','text/plain')
            self.end_headers()
            self.wfile.write(get_new_user_id())
        else:
            self.send_response(200)


    def do_POST(self):

        request_path = self.path

        print("\n----- Request Start ----->\n")
        #print(request_path)

        request_headers = self.headers
        content_length = request_headers.getheaders('content-length')
        length = int(content_length[0]) if content_length else 0

        #print(request_headers)
        print("-------------BODY START----------------")
        body = self.rfile.read(length)
        dict = json.loads(body)
        # Add activity to table
        act = (dict["user_id"], dict['Action'], dict['New value'], dict['url'], dict['time'])
        print(act)
        activity_id = create_activity(act)
        print("<----- Request End -----\n")

        self.send_response(200)

    do_PUT = do_POST
    do_DELETE = do_GET

def get_new_user_id():
    conn = sqlite3.connect(database)
    cur = conn.cursor()
    cur.execute(''' SELECT MAX(id) FROM user_ids''')
    last_user_id = cur.fetchone()
    id = last_user_id[0]
    if(id == None):
        id = 1
    else:
        id += 1
    set_user_id(id)
    cur.close()
    return id

def set_user_id(id_num):
    """
    Add new user_id into the id table
    :param act:
    :return: action id
    """
    date = datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
    print(date)
    input_info = (id_num, date)
    sql = ''' INSERT INTO user_ids(id, date_created)
              VALUES(?,?) '''
    conn = sqlite3.connect(database)
    cur = conn.cursor()
    cur.execute(sql, input_info)
    conn.commit()
    return cur.lastrowid


def create_activity(act):
    """
    Add new activity into the activity table
    :param act:
    :return: action id
    """
    sql = ''' INSERT INTO activity(user_id, action, value, url, time)
              VALUES(?,?,?,?,?) '''

    conn = sqlite3.connect(database)
    cur = conn.cursor()
    cur.execute(sql, act)
    conn.commit()
    return cur.lastrowid

def create_table(create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        conn = sqlite3.connect(database)
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)


def main():

    sql_create_activity_table = """ CREATE TABLE IF NOT EXISTS activity (
                                    user_id integer,
                                    action text,
                                    value text,
                                    url text,
                                    time text
                                ); """

    sql_create_id_table = """ CREATE TABLE IF NOT EXISTS user_ids (
                                    id integer PRIMARY KEY,
                                    date_created text
                                ); """

    #conn = create_connection(database)
    try:
        conn = sqlite3.connect(database)
        #return conn
    except Error as e:
        print(e)
    #return conn

    if conn is not None:
        print("Successful connection to database.")
        print(conn)
        # create
        create_table(sql_create_activity_table)
        create_table(sql_create_id_table)
    else:
        print("Error! cannot create the database connection.")

    port = 8080
    print('Listening on localhost:%s' % port)
    server = HTTPServer(('', port), RequestHandler)
    server.serve_forever()


if __name__ == "__main__":
    parser = OptionParser()
    parser.usage = ("Creates an http-server that will echo out any GET or POST parameters\n"
                    "Run:\n\n"
                    "   reflect")
    (options, args) = parser.parse_args()

    main()
