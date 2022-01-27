import requests
import random
import json

def signup(username='myusername{}'.format(random.randint(1000,99999999)),password='bar'):
    r1 = requests.post('http://localhost:8080/signup', json={'username':username,'password':password})
    print("json request: ", r1.text)

def login(username, password):
    r = requests.post('http://localhost:8081/login', json={'username':username,'password':password})
    print(r.text)

def get_users():
    r2 = requests.get('http://localhost:8081/get_users')
    return json.loads(r2.text)

def get_user(username):
    users = get_users()
    for user in users:
        if user[1] == username:
            return user

# signup()
# get_users()

