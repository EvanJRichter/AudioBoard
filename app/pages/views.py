from app.app_and_db import app, db, oauth
from app.pages.models import City, Response
from datetime import datetime
from flask import jsonify, render_template, redirect, request, url_for
from textblob import TextBlob

import requests

@app.route('/timeline/')
def show_timeline():
    link_array = [1,2,3,4]
    return render_template('pages/slider.html', my_list=link_array)

@app.route('/')
def index():
  return render_template('pages/home_page.html')

@app.route('/api/getnoun/<string:input_phrase>/')
def get_noun(input_phrase):
  print(input_phrase)
  #stick textblob here
  api_response = 'hello'

  blob = TextBlob(input_phrase)
  tags = blob.tags
  print(len(tags))
  for tag in tags:
      word = tag[0]
      pos = tag[1]
      if pos == "NN" or pos == "NNS":
          print(word)
          return word

  return "black"


@app.route('/api/getnoun')
def cities():
  whoa = "whoa"
  print whoa
  return str(whoa)

@app.teardown_appcontext
def shutdown_session(exception=None):
  db.remove()
