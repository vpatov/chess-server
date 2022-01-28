import requests
import random
import json

port = 8080
host = 'http://vasinator:{}'.format(port)

def signup(username='myusername{}'.format(random.randint(1000,99999999)),password='bar'):
    r1 = requests.post('{}/signup'.format(host), json={'username':username,'password':password})
    print("json request: ", r1.text)

def login(username, password):
    r = requests.post('{}/login'.format(host), json={'username':username,'password':password})
    print(r.text)

def get_users():
    r2 = requests.get('{}/get_users'.format(host))
    return json.loads(r2.text)

def get_user(username):
    users = get_users()
    for user in users:
        if user[1] == username:
            return user

# signup()
# get_users()

