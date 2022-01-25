import requests

import random

def signup(username='myusername{}'.format(random.randint(1234,5678)),password='bar'):
    r1 = requests.post('http://localhost:8081/signup', json={'username':username,'password':password})
    print("json request: ", r1.text)

def login(username, password):
    r = requests.post('http://localhost:8081/login', json={'username':username,'password':password})
    print(r.text)

def get_users():
    r2 = requests.get('http://localhost:8081/get_users')
    print(r2.text)

# signup()
# get_users()

