'''
    olympics-api.py
    Aiden Chang, Daniel Kim 1 Febuary 2021
    Updated 1 Febuary 2021

    Retreiving results from database olympics using api
'''

import psycopg2
import sys
import argparse
import flask
import json
from config import password 
from config import database
from config import user



app = flask.Flask(__name__)
@app.route('/help')
def get_help():
    '''
    Loads an html document with the commands available.
    '''
    print()
    return flask.render_template('help.html')

@app.route('/games')
def get_games():
    '''
    Returns a list of dictionaries, each dictionary represents 
    one Olympic games, sorted by year.
    See \help for details
    '''
    connection = connect_to_database()

    query = "\
        SELECT DISTINCT games.id, games.game_year, games.season, cities.city_name\
        FROM games, cities, games_cities\
        WHERE games.id = games_cities.game_id\
        AND cities.id = games_cities.city_id\
        ORDER BY games.game_year;\
        "

    cursor = getCursor(query, connection)
    return_list = []

    for row in cursor:
        row_dic = {}
        row_dic['id'] = row[0]
        row_dic['year'] = row[1]
        row_dic['season'] = row[2]
        row_dic['city'] = row[3]
        return_list.append(row_dic)

    connection.close()
    return json.dumps(return_list)

@app.route('/nocs')
def get_nocs():
    '''
    Returns a list of dictionaries each of which represents one
    National Olympic Committee, alphabetized by NOC abbreviation.
    See \help for details
    '''
    connection = connect_to_database()
    
    query = "\
        SELECT DISTINCT nocs.noc_name, nocs.region\
        FROM nocs\
        ORDER BY nocs.noc_name;\
        "

    cursor = getCursor(query, connection)
    return_list = []

    for row in cursor:
        row_dic = {}
        row_dic['abbreviation'] = row[0]
        row_dic['name'] = row[1]
        return_list.append(row_dic)

    connection.close()
    return json.dumps(return_list)

@app.route('/medalists/games/<games_id>')
    #localhost:5000/medalists/games/12?noc=USA
def get_medalists(games_id):
    '''
    Returns the list of dictionaries each representing one athlete 
    who earned a medal in the specified games. If the GET parameter 
    noc=noc_abbreviation is present, this endpoint will return
    only those medalists who were on the specified NOC's team during 
    the specified games.
    See \help for details
    '''
    noc = flask.request.args.get('noc')
    connection = connect_to_database()
    query = f"\
        SELECT DISTINCT athletes.id, athletes.full_name, athletes.sex, events.sport, events.event_name, medals.medal\
        FROM medals, events, games, athletes, nocs, athletes_nocs\
        WHERE medals.game_id = {games_id}\
        AND athletes.id = medals.athlete_id\
        AND events.id = medals.event_id\
        AND medals.medal != 'NA'\
        "
        

    if noc is not None:
        query = query + f"\nAND nocs.noc_name = '{noc}'  \
            AND athletes.id = athletes_nocs.athlete_id \
            AND nocs.id = athletes_nocs.noc_id"
    
    query = query + ';'

    cursor = getCursor(query, connection)
    return_list = []

    for row in cursor:
        row_dic = {}
        row_dic['athlete_id'] = row[0]
        row_dic['athlete_name'] = row[1]
        row_dic['athlete_sex'] = row[2]
        row_dic['sport'] = row[3]
        row_dic['event'] = row[4]
        row_dic['medal'] = row[5]
        return_list.append(row_dic)

    connection.close()
    return json.dumps(return_list)
    

def connect_to_database():
    '''
    Will establish a connection to the database.
    If an error ocurs, it will be printed out ten the code will exit

    Returns:
        connection: the connection object to the database
    '''
    try:
        connection = psycopg2.connect(database=database, user=user, password=password)
        return connection
    except Exception as e:
        print(e)
        exit()

def getCursor(query, connection, search_string = None):
    '''
    Query the database, creating a cursor object allowing you to use to iterate over the rows generated by your query.

    Parameters:
        query: the query you would like your cursor to iterate over
        connection: the connection object to your database
        search_string: optional argument. If a search string is specified, the cursor will execute the query with the userinput( the search string)
    Returns:
        cursor: the cursor object that can be used to iterate rows over the specified query
    '''
    try:
        cursor = connection.cursor()
        if search_string != None:
            cursor.execute(query, (search_string,))
        else:
            cursor.execute(query)
        return cursor
    except Exception as e:
        print(e)
        exit()

if __name__ == '__main__':
    parser = argparse.ArgumentParser('A Flask application that allows you to access olympics/API')
    parser.add_argument('host', help='the host on which this application is running')
    parser.add_argument('port', type=int, help='the port on which this application is listening')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True)