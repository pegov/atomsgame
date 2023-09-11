from app.game import Board, Coord


def test_scan_intersection():
    two_atoms_bottom = [Coord(5, 7), Coord(6, 7)]
    game = Board(8, 8, two_atoms_bottom)
    n = game.scan_intersection(21)
    assert n == 21

    two_atoms_top = [Coord(5, 0), Coord(6, 0)]
    game = Board(8, 8, two_atoms_top)
    n = game.scan_intersection(7)
    assert n == 7

    two_atoms_left = [Coord(0, 2), Coord(0, 3)]
    game = Board(8, 8, two_atoms_left)
    n = game.scan_intersection(33)
    assert n == 33

    two_atoms_right = [Coord(7, 2), Coord(7, 3)]
    game = Board(8, 8, two_atoms_right)
    n = game.scan_intersection(13)
    assert n == 13

    one_atom_center = [Coord(3, 4)]
    game = Board(8, 8, one_atom_center)
    n = game.scan_intersection(4)
    assert n == 32

    two_atoms_center_1 = [Coord(3, 4), Coord(4, 4)]
    game = Board(8, 8, two_atoms_center_1)
    n = game.scan_intersection(5)
    assert n == 5

    two_atoms_center_2 = [Coord(3, 4), Coord(4, 3)]
    game = Board(8, 8, two_atoms_center_2)
    n = game.scan_intersection(5)
    assert n == 33

    one_atom_left_top_corner = [Coord(0, 0)]
    game = Board(8, 8, one_atom_left_top_corner)
    n = game.scan_intersection(1)
    assert n == 36
    n = game.scan_intersection(36)
    assert n == 1
    n = game.scan_intersection(2)
    assert n == 10
    n = game.scan_intersection(10)
    assert n == 2
    n = game.scan_intersection(35)
    assert n == 27
    n = game.scan_intersection(35)
    assert n == 27
    n = game.scan_intersection(11)
    assert n == 26
    n = game.scan_intersection(26)
    assert n == 11
    n = game.scan_intersection(12)
    assert n == 34

    one_atom_right_top_corner = [Coord(7, 0)]
    game = Board(8, 8, one_atom_right_top_corner)
    n = game.scan_intersection(8)
    assert n == 36
    n = game.scan_intersection(9)
    assert n == 10
    n = game.scan_intersection(10)
    assert n == 9
    n = game.scan_intersection(11)
    assert n == 19
    n = game.scan_intersection(19)
    assert n == 11
    n = game.scan_intersection(20)
    assert n == 35
    n = game.scan_intersection(35)
    assert n == 20
    n = game.scan_intersection(36)
    assert n == 8

    one_atom_left_bottom_corner = [Coord(0, 7)]
    game = Board(8, 8, one_atom_left_bottom_corner)
    n = game.scan_intersection(1)
    assert n == 29
    n = game.scan_intersection(2)
    assert n == 17
    n = game.scan_intersection(17)
    assert n == 2
    n = game.scan_intersection(18)
    assert n == 26
    n = game.scan_intersection(26)
    assert n == 18
    n = game.scan_intersection(27)
    assert n == 28
    n = game.scan_intersection(28)
    assert n == 27
    n = game.scan_intersection(29)
    assert n == 1

    one_atom_right_bottom_corner = [Coord(7, 7)]
    game = Board(8, 8, one_atom_right_bottom_corner)
    n = game.scan_intersection(8)
    assert n == 29
    n = game.scan_intersection(9)
    assert n == 17
    n = game.scan_intersection(17)
    assert n == 9
    n = game.scan_intersection(18)
    assert n == 19
    n = game.scan_intersection(19)
    assert n == 18
    n = game.scan_intersection(20)
    assert n == 28
    n = game.scan_intersection(28)
    assert n == 20
    n = game.scan_intersection(29)
    assert n == 8
