from typing import Literal, Union

from pydantic import Field

from app.model.common import DefaultModel


class GameSettings(DefaultModel):
    size_x: int
    size_y: int
    atoms_count: int


class GameCreateRequest(DefaultModel):
    settings: GameSettings


class ScanRequest(DefaultModel):
    type: Literal["scan"]
    input: int


class Coord(DefaultModel):
    x: int
    y: int


class SuggestRequest(DefaultModel):
    type: Literal["suggest"]
    coords: list[Coord]


class Start(DefaultModel):
    type: Literal["start"]
    settings: GameSettings


class ClientMessage(DefaultModel):
    message: Union[ScanRequest, SuggestRequest, Start] = Field(
        ..., discriminator="type"
    )


class ScanResponse(DefaultModel):
    type: Literal["scan"]
    input: int
    output: int


class SuggestResponse(DefaultModel):
    type: Literal["suggest"]
    success: bool


class ErrorResponse(DefaultModel):
    type: Literal["error"]
    error: str
