import asyncio
import websockets

async def hello():
    async with websockets.connect("ws://localhost:9002") as websocket:
        await websocket.send("LETS GO")
        print(await websocket.recv())
        print("got response?")


def t():
    asyncio.run(hello())