from flask import Flask, request
import psycopg2
import json
import hashlib
import random
import os

conn = psycopg2.connect('dbname=chess_server user=vas')
table_name = 'users'

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/get_users', methods=['GET'])
def get_users():
    cur = conn.cursor()
    cur.execute('SELECT * from users')
    result = cur.fetchall()
    print(result)
    return json.dumps(result)

def get_user(username):
    cur = conn.cursor()
    query = "SELECT * from users WHERE username = '{}';".format(username)
    cur.execute(query)
    result = cur.fetchone()

    cur.close()

    return result
    

@app.route('/signup', methods=['POST'])
def signup():
    json_body = json.loads(request.data)
    username = json_body['username']
    password: str = json_body['password']

    if (get_user(username) is not None):
        return json.dumps({'error':'Username {} is taken already.'.format(username)})

    salt = os.urandom(10)
    salted_password_bytes = password.encode() + salt

    print("password: ", password)
    print("salted_password_bytes: ", salted_password_bytes)

    hashed_password = hashlib.sha256(salted_password_bytes)

    cur = conn.cursor()

    query = """
    INSERT INTO users (username, salt, hashed_password) VALUES
        ('{}', '{}', '{}');    
        """.format(username, salt.hex(), hashed_password.hexdigest())
    print(query)
    cur.execute(query)

    conn.commit()
    cur.close()

    return json.dumps({
        'status': 'ok',
        'username': username,
        'hashed_password': hashed_password.hexdigest(),
        'salt': salt.hex()})


@app.route('/login',methods=['POST'])
def login():
    json_body = json.loads(request.data)
    username = json_body['username']
    password = json_body['password']

    user = get_user(username)
    if (user is None):
        return json.dumps({'error':'Username {} is not registered.'.format(username)})

    (user_id, _username, salt, stored_hash) = user
    assert(username == _username)

    salted_password_bytes = password.encode() + bytes.fromhex(salt)
    hashed_password = hashlib.sha256(salted_password_bytes)

    if (hashed_password.hexdigest() == stored_hash):
        return json.dumps({'status': 'ok'})
    else:
        return json.dumps({'error': 'Incorrect password.'})





app.run(host='0.0.0.0', port=8081, debug=True)
