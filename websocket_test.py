import asyncio
import websockets

async def hello():
    async with websockets.connect("ws://192.168.1.12:8081") as websocket:
        await websocket.send("MESSAGE_001")
        print(await websocket.recv())

        await websocket.send("MESSAGE_002")
        print(await websocket.recv())

        await websocket.send("MESSAGE_003")
        await websocket.send("MESSAGE_004")
        print(await websocket.recv())
        print(await websocket.recv())


def t():
    asyncio.run(hello())