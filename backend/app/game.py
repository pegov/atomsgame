from enum import Enum

from app.model.game import Coord as CoordModel


class Coord:
    x: int
    y: int

    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    def __eq__(self, another) -> bool:
        return self.x == another.x and self.y == another.y

    def __repr__(self) -> str:
        return f"Coord: ({self.x}, {self.y})"

    @classmethod
    def from_model(cls, model: CoordModel) -> "Coord":
        return cls(model.x, model.y)


class Direction(Enum):
    UP = 0
    DOWN = 1
    LEFT = 2
    RIGHT = 3


class Board:
    size_x: int
    size_y: int

    atoms: list[Coord]

    _top_min_intersection: int
    _top_max_intersection: int
    _right_min_intersection: int
    _right_max_intersection: int
    _bottom_min_intersection: int
    _bottom_max_intersection: int
    _left_min_intersection: int
    _left_max_intersection: int

    def __init__(self, size_x: int, size_y: int, atoms: list[Coord]):
        self.size_x = size_x
        self.size_y = size_y
        self.atoms = sorted(atoms, key=lambda k: (k.x, k.y))

        self._top_min_intersection = 1
        self._top_max_intersection = size_x + 1

        self._right_min_intersection = size_x + 2
        self._right_max_intersection = size_x + size_y + 2

        self._bottom_min_intersection = size_x + size_y + 3
        self._bottom_max_intersection = 2 * size_x + size_y + 3

        self._left_min_intersection = 2 * size_x + size_y + 4
        self._left_max_intersection = 2 * size_x + 2 * size_y + 4

    def __repr__(self) -> str:
        return f"""
Game:
    size = ({self.size_x}, {self.size_y})
    atoms = {self.atoms}

    top_min = {self._top_min_intersection}
    top_max = {self._top_min_intersection}

    bottom_min = {self._bottom_min_intersection}
    bottom_max = {self._bottom_max_intersection}

    left_min = {self._left_min_intersection}
    left_max = {self._left_max_intersection}

    right_min = {self._right_min_intersection}
    right_max = {self._right_max_intersection}
"""

    def set_atoms(self, atoms: list[Coord]):
        self.atoms = sorted(atoms, key=lambda k: (k.x, k.y))

    def _get_first_direction(self, n: int) -> Direction:
        if n >= self._top_min_intersection and n <= self._top_max_intersection:
            return Direction.DOWN
        elif n >= self._right_min_intersection and n <= self._right_max_intersection:
            return Direction.LEFT
        elif n >= self._bottom_min_intersection and n <= self._bottom_max_intersection:
            return Direction.UP
        elif n >= self._left_min_intersection and n <= self._left_max_intersection:
            return Direction.RIGHT
        else:
            raise Exception("wrong n")

    def _intersection_to_coord(self, n: int, direction: Direction) -> Coord:
        if direction == Direction.DOWN:
            return Coord(n - 1, 0)
        elif direction == Direction.LEFT:
            return Coord(self.size_x, n - self.size_x - 2)
        elif direction == Direction.UP:
            left_bottom_corner_n = self.size_x + self.size_y + self.size_x + 3
            return Coord(left_bottom_corner_n - n, self.size_y)
        elif direction == Direction.RIGHT:
            return Coord(0, self.size_x * 2 + self.size_y * 2 - n + 4)
        else:
            raise Exception("unreachable")

    def _coord_to_intersection(self, c: Coord, direction: Direction) -> int:
        if direction == Direction.DOWN:
            return self.size_x + self.size_y + self.size_x + 3 - c.x

        elif direction == Direction.LEFT:
            return self.size_x + self.size_y + self.size_x + self.size_y - c.y + 4

        elif direction == Direction.UP:
            return c.x + 1

        elif direction == Direction.RIGHT:
            return self.size_x + 2 + c.y

        else:
            raise Exception("unreachable")

    def _step(self, c: Coord, direction: Direction) -> tuple[Coord, Direction]:
        if direction == Direction.UP:
            look_1 = Coord(c.x - 1, c.y - 1) in self.atoms  # left
            look_2 = Coord(c.x, c.y - 1) in self.atoms  # right

            if look_1 and look_2:
                return c, Direction.DOWN

            elif look_1:
                return Coord(c.x + 1, c.y), Direction.RIGHT

            elif look_2:
                return Coord(c.x - 1, c.y), Direction.LEFT

            else:
                return Coord(c.x, c.y - 1), Direction.UP

        elif direction == Direction.DOWN:
            look_1 = Coord(c.x - 1, c.y) in self.atoms  # left
            look_2 = c in self.atoms  # right

            if look_1 and look_2:
                return Coord(c.x, c.y - 1), Direction.UP

            elif look_1:
                return Coord(c.x + 1, c.y), Direction.RIGHT

            elif look_2:
                return Coord(c.x - 1, c.y), Direction.LEFT

            else:
                return Coord(c.x, c.y + 1), Direction.DOWN

        elif direction == Direction.LEFT:
            look_1 = Coord(c.x - 1, c.y - 1) in self.atoms  # top
            look_2 = Coord(c.x - 1, c.y) in self.atoms  # bottom

            if look_1 and look_2:
                return Coord(c.x + 1, c.y), Direction.RIGHT

            elif look_1:
                return Coord(c.x, c.y + 1), Direction.DOWN

            elif look_2:
                return Coord(c.x, c.y - 1), Direction.UP

            else:
                return Coord(c.x - 1, c.y), Direction.LEFT

        elif direction == Direction.RIGHT:
            look_1 = Coord(c.x, c.y - 1) in self.atoms  # top
            look_2 = c in self.atoms  # bottom

            if look_1 and look_2:
                return Coord(c.x - 1, c.y), Direction.LEFT

            elif look_1:
                return Coord(c.x, c.y + 1), Direction.DOWN

            elif look_2:
                return Coord(c.x, c.y - 1), Direction.UP

            else:
                return Coord(c.x + 1, c.y), Direction.RIGHT

        else:
            raise Exception("unreachable")

    def _scan_is_complete(self, c: Coord, direction: Direction) -> bool:
        if direction == Direction.UP:
            return c.y < 0

        elif direction == Direction.DOWN:
            return c.y > self.size_y

        elif direction == Direction.LEFT:
            return c.x < 0

        elif direction == Direction.RIGHT:
            return c.x > self.size_x

        else:
            raise Exception("unreachable")

    def suggest_atoms(self, suggestion: list[Coord]) -> bool:
        sorted_suggestion = sorted(suggestion, key=lambda k: (k.x, k.y))
        for v1, v2 in zip(sorted_suggestion, self.atoms):
            if v1 != v2:
                return False

        return True

    def scan_intersection(self, n: int) -> int:
        curr_d = self._get_first_direction(n)
        curr_c = self._intersection_to_coord(n, curr_d)

        peek_c, peek_d = self._step(curr_c, curr_d)
        curr_d = peek_d

        while not self._scan_is_complete(peek_c, peek_d):
            curr_c = peek_c
            curr_d = peek_d
            peek_c, peek_d = self._step(curr_c, curr_d)

        return self._coord_to_intersection(curr_c, peek_d)
