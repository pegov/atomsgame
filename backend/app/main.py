import random
from typing import cast

import orjson
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import ORJSONResponse

from app.config import DEBUG, VERSION
from app.game import Board, Coord
from app.model.game import (
    ClientMessage,
    ScanRequest,
    ScanResponse,
    SuggestRequest,
    SuggestResponse,
)


def get_app():
    app = FastAPI(
        debug=DEBUG,
        version=VERSION,
        default_response_class=ORJSONResponse,
    )

    return app


app = get_app()


def random_atoms(x: int, y: int, n: int) -> list[Coord]:
    return [Coord(i % x, i // y) for i in random.sample(range(0, x * y), n)]


@app.websocket("/ws/games", name="games:ws_main")
async def games_ws_main(
    ws: WebSocket,
):
    size_x = 4
    size_y = 4
    atoms_count = 4
    atoms = random_atoms(size_x, size_y, atoms_count)
    board = Board(size_x, size_y, atoms)
    await ws.accept()
    try:
        while True:
            data = await ws.receive_text()
            client_message = ClientMessage(message=orjson.loads(data))

            t = client_message.message.type
            if t == "scan":
                scan_request = cast(ScanRequest, client_message.message)
                output = board.scan_intersection(scan_request.input)
                scan_response = ScanResponse(
                    type="scan",
                    input=scan_request.input,
                    output=output,
                )
                await ws.send_text(scan_response.model_dump_json(by_alias=True))
            elif "suggest":
                suggest_request = cast(SuggestRequest, client_message.message)
                if len(suggest_request.coords) == atoms_count:
                    suggest_response = SuggestResponse(
                        type="suggest",
                        success=board.suggest_atoms(
                            [Coord.from_model(v) for v in suggest_request.coords]
                        ),
                    )
                    await ws.send_text(suggest_response.model_dump_json(by_alias=True))
                else:
                    pass
            else:
                pass

    except WebSocketDisconnect:
        pass
