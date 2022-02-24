import asyncio
import websockets
import requests
import json
import colorama
import sys
import random
import time

WHITE_CLIENT_UUID = "whiterobotplayer001"
BLACK_CLIENT_UUID = "blackrobotplayer001"
HOST = "vasconbox"
WS_PORT = 59202
HTTP_PORT = 59201

ClientWsActionType = {
    "START_GAME": 0,
    "MAKE_MOVE": 1,
    "RESIGN": 2,
    "OFFER_DRAW": 3,
    "ACCEPT_DRAW_OFFER": 4,
    "TAKE_BACK_DRAW_OFFER": 5,
    "DECLINE_DRAW_OFFER": 6,
}


def minutes_to_millis(minutes):
    return minutes * 60 * 1000


default_request_body = {
    "white_time_control": {
        "time_left_ms": minutes_to_millis(5),
        "increment_ms": 0,
    },
    "black_time_control": {
        "time_left_ms": minutes_to_millis(5),
        "increment_ms": 0,
    },
    "use_matchmaking_pool": False,
    "player_requests_white": True,
    "requestor_client_uuid": WHITE_CLIENT_UUID,
}


def create_game():
    r = requests.post(
        "http://{host}:{port}/create_game".format(host=HOST, port=HTTP_PORT),
        data=json.dumps(default_request_body),
    )
    response = r.json()
    game_instance_uuid = response["game_instance_uuid"]
    return game_instance_uuid


class Player:
    def __init__(self, client_uuid):
        self.handlers = {
            "GAME_INIT": self.handle_game_init_message,
            "GAME_STATE_UPDATE": self.handle_game_state_update_message,
        }
        if client_uuid is None:
            raise Exception("Must provide clientUUID during Player initialization")
        self.client_uuid = client_uuid
        self.has_made_first_move = False

    async def connect_to_game(self, game_instance_uuid):
        connection_url = (
            "ws://{host}:{port}?gameInstanceUUID={gid}&clientUUID={cid}".format(
                host=HOST, port=WS_PORT, gid=game_instance_uuid, cid=self.client_uuid
            )
        )
        print(
            colorama.Fore.GREEN,
            "Connecting to game instance: {}".format(game_instance_uuid),
            colorama.Fore.RESET,
        )
        async with websockets.connect(connection_url) as websocket:
            self.websocket = websocket
            while True:
                message = await websocket.recv()
                await self.process_message(json.loads(message))

    async def process_message(self, message):
        message_type = message["messageType"]
        if message_type is None:
            raise Exception("Did not find message_type in payload: {}".format(message))

        handler = self.handlers[message_type]
        if handler is None:
            raise Exception("No handler for {}".format(message_type))

        payload = message["payload"]
        if payload is None:
            raise Exception("No payload in message: {}".format(message))

        # print("Processing payload:")
        # print(
        #     colorama.Fore.LIGHTMAGENTA_EX
        #     + json.dumps(payload)
        #     + colorama.Fore.RESET
        # )
        await handler(payload)

    async def send_message(self, message):
        if self.websocket is None:
            raise Exception("Cannot make a move, because websocket is null.")
        await self.websocket.send(json.dumps(message))

    async def send_start_game_message(self):
        message = {"type": ClientWsActionType["START_GAME"], "payload": ""}
        await self.send_message(message)

    async def send_make_move_message(self, move):
        if not self.has_made_first_move:
            print(
                "Sleeping for five seconds before making first move "
                "so human has chance to load webpage"
            )
            time.sleep(5)

            await self.send_start_game_message()
            self.has_made_first_move = True

        message = {"type": ClientWsActionType["MAKE_MOVE"], "payload": move}
        await self.send_message(message)

    async def handle_game_init_message(self, payload):
        self.client_playing_white = payload["client_playing_white"]
        self.color = "white" if self.client_playing_white else "black"

    async def handle_game_state_update_message(self, payload):
        print("handle_game_state_update_message")
        print(
            colorama.Fore.LIGHTMAGENTA_EX,
            'legal_moves length:', len(payload['legal_moves']),
            'currentTurn:', payload['currentTurn'],
            colorama.Fore.RESET
        )
        is_our_turn = payload["currentTurnClientUUID"] == self.client_uuid
        game_instance_state = payload["game_instance_state"]
        if not is_our_turn:
            print("Not our turn, waiting...")
            return

        if game_instance_state == 0:
            print("Game has not yet started, waiting...")
            return

        legal_moves = payload["legal_moves"]
        random_move = random.sample(legal_moves, 1)[0]

        # sleep before sending the move so that it doesn't happen too fast for the eye to see
        # time.sleep(0.1)  ## 🤘 ##
        await self.send_make_move_message(random_move)


if __name__ == "__main__":
    if sys.argv[1] is None:
        raise Exception(
            "Must provide player color in program args (i.e. python3 player.py white)"
        )

    if sys.argv[1] == "white":
        is_white = True
    elif sys.argv[1] == "black":
        is_white = False
    else:
        raise Exception(
            'Player color arg must be either "white" or "black" (without quotes).'
        )

    try:
        game_instance_uuid = sys.argv[2]
    except:
        game_instance_uuid = create_game()

    client_uuid = WHITE_CLIENT_UUID if is_white else BLACK_CLIENT_UUID

    player = Player(client_uuid)
    asyncio.run(player.connect_to_game(game_instance_uuid))


# async def hello():
#     async with websockets.connect("ws://vasconbox:59202") as websocket:
#         await
#         await websocket.send("MESSAGE_001")
#         print(await websocket.recv())

#         await websocket.send("MESSAGE_002")
#         print(await websocket.recv())

#         await websocket.send("MESSAGE_003")
#         await websocket.send("MESSAGE_004")
#         print(await websocket.recv())
#         print(await websocket.recv())


# def t():
#     asyncio.run(hello())
