import requests
import random
import json
import sys



port = 8080
host = 'vasinator'

if len(sys.argv) > 1:
    host = sys.argv[1]
    port = sys.argv[2]

url = 'http://{}:{}'.format(host,port)

print("Ready to make requests to {}".format(url))

def create_game():
    r1 = requests.post('{}/create_game'.format(url),json={})
    uuid = r1.text
    print(uuid)


def signup(username='myusername{}'.format(random.randint(1000,99999999)),password='bar'):
    r1 = requests.post('{}/signup'.format(url), json={'username':username,'password':password})
    print("json request: ", r1.text)

def login(username, password):
    r = requests.post('{}/login'.format(url), json={'username':username,'password':password})
    print(r.text)

def get_users():
    r2 = requests.get('{}/get_users'.format(url))
    return json.loads(r2.text)

def get_user(username):
    users = get_users()
    for user in users:
        if user[1] == username:
            return user

# signup()
# get_users()

