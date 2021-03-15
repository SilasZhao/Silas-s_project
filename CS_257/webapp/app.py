#!/usr/bin/env python3
'''
    webapp.py
    Aiden Chang, Silas Zhao
    22 December 2021

    Flask web application for covid-19 website. 
'''
import sys
import argparse
import flask
import api

app = flask.Flask(__name__, static_folder='static', template_folder='templates')
app.register_blueprint(api.api, url_prefix='/api')

@app.route('/')
def home():
    return flask.render_template('home_index.html')
@app.route('/api/help')
def help():
    return_string = ''
    lines = open("templates/help.txt", "r")
    for line in lines:
        line = line + '<br/>'
        return_string = return_string + line
    return return_string
@app.route('/state_detail')
def state_detail():
    return flask.render_template('state_detail.html')
@app.route('/<path:path>')
def shared_header_catchall(path):
    return flask.render_template(path)

if __name__ == '__main__':
    parser = argparse.ArgumentParser('A flask application for our covid website')
    parser.add_argument('host', help='the host on which this application is running')
    parser.add_argument('port', type=int, help='the port on which this application is listening')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True)