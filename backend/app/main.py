import random
from typing import cast

import orjson
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import ORJSONResponse

from app.config import DEBUG, VERSION
from app.game import Board, Coord
from app.model.game import (
    ClientMessage,
    ErrorResponse,
    GameSettings,
    ScanRequest,
    ScanResponse,
    Start,
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


def _validate_settings_size(size: int) -> None:
    if size < 2 or size > 10:
        raise Exception("Размер должен быть не меньше 2 и не больше 10")


def validate_settings(settings: GameSettings) -> None:
    _validate_settings_size(settings.size_x)
    _validate_settings_size(settings.size_y)

    if settings.atoms_count < 1:
        raise Exception("Количество атомов не может быть меньше 1")

    m = settings.size_x * settings.size_y
    if settings.atoms_count > m - 1:
        raise Exception(f"Количество атомов не может быть больше {m - 1}")


def validate_scan(scan: ScanRequest, size_x: int, size_y: int) -> None:
    if scan.input < 0:
        raise Exception("Скан меньше 0")

    max_input = 2 * size_x + 2 * size_y + 4
    if scan.input > max_input:
        raise Exception(f"Скан больше {max_input}")


def validate_suggest(suggest: SuggestRequest, atoms_count: int) -> None:
    suggested_atoms_count = len(suggest.coords)
    if len(suggest.coords) != atoms_count:
        raise Exception(
            f"Отправлено {suggested_atoms_count} атомов. Должно быть {atoms_count}.",
        )


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
            if t == "start":
                start = cast(Start, client_message.message)
                try:
                    validate_settings(start.settings)
                except Exception as e:
                    error_response = ErrorResponse(type="error", error=str(e))
                    await ws.send_text(error_response.model_dump_json(by_alias=True))
                    continue
                size_x = start.settings.size_x
                size_y = start.settings.size_y
                atoms_count = start.settings.atoms_count
                board = Board(
                    size_x,
                    size_y,
                    random_atoms(size_x, size_y, atoms_count),
                )
                await ws.send_text(start.model_dump_json(by_alias=True))
            elif t == "scan":
                scan_request = cast(ScanRequest, client_message.message)
                try:
                    validate_scan(scan_request, size_x, size_y)
                except Exception as e:
                    error_response = ErrorResponse(type="error", error=str(e))
                    await ws.send_text(error_response.model_dump_json(by_alias=True))
                    continue
                output = board.scan_intersection(scan_request.input)
                scan_response = ScanResponse(
                    type="scan",
                    input=scan_request.input,
                    output=output,
                )
                await ws.send_text(scan_response.model_dump_json(by_alias=True))
            elif "suggest":
                suggest_request = cast(SuggestRequest, client_message.message)
                try:
                    validate_suggest(suggest_request, atoms_count)
                except Exception as e:
                    error_response = ErrorResponse(type="error", error=str(e))
                    await ws.send_text(error_response.model_dump_json(by_alias=True))
                    continue
                suggest_response = SuggestResponse(
                    type="suggest",
                    success=board.suggest_atoms(
                        [Coord.from_model(v) for v in suggest_request.coords]
                    ),
                )
                await ws.send_text(suggest_response.model_dump_json(by_alias=True))
            else:
                pass

    except WebSocketDisconnect:
        pass
