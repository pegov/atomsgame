import { FC } from "react"

import Indicator from "@/components/Indicator"

import { type Coord, type Settings } from "@/types/game"


interface Props {
  settings: Settings
  scanPairs: number[][]
  scan: (n: number) => void
  suggestion: Coord[]
  toggleAtom: (x: number, y: number) => void
}


const Board: FC<Props> = ({ settings, scanPairs, scan, suggestion, toggleAtom }) => {
  const buildBoard = (sizeX: number, sizeY: number): number[][][] => {
    const n = sizeX * 2 + sizeY * 2 + 4

    const rows: number[][][] = []
    for (let i = 0; i < sizeY; i++) {
      const row = []
      for (let j = 0; j < sizeX; j++) {
        const cell = []

        // others
        if (i !== 0 && i !== sizeY - 1 && j !== 0 && j !== sizeX - 1) {
          row.push([])
          continue
        }

        // top left
        if (i === 0 && j === 0) {
          cell.push(1)
          cell.push(n)
          row.push(cell)
          continue
        }

        // top right
        if (i === 0 && j === sizeX - 1) {
          cell.push(sizeX)
          cell.push(sizeX + 1)
          cell.push(sizeX + 2)
          row.push(cell)
          continue
        }

        // top without corners
        if (i === 0) {
          cell.push(j + 1)
          row.push(cell)
          continue
        }

        // bottom left
        if (i === sizeY - 1 && j === 0) {
          const k = n - sizeY - 1
          cell.push(k)
          cell.push(k + 1)
          cell.push(k + 2)
          row.push(cell)
          continue
        }

        // left without corners
        if (j === 0) {
          cell.push(n - i)
          row.push(cell)
          continue
        }

        // bottom right
        if (i === sizeY - 1 && j === sizeX - 1) {
          const k = n - sizeY - 1 - sizeX - 1 - 1
          cell.push(k)
          cell.push(k + 1)
          cell.push(k + 2)
          cell.push(k + 3)
          row.push(cell)
          continue
        }

        // right without corners
        if (j === sizeX - 1) {
          cell.push(sizeX + 2 + i)
          row.push(cell)
          continue
        }

        // bottom without corners
        if (i === sizeY - 1) {
          cell.push(n - sizeY - 1 - j)
          row.push(cell)
          continue
        }
      }

      rows.push(row)
    }

    return rows
  }

  const rows = buildBoard(settings.sizeX, settings.sizeY)

  return (
    <div className="board">
      <div className="board-inner">
        {rows.map((row, y) =>
          <div key={y} className="row">
            {row.map((cell, x) =>
              <div
                key={x}
                className="cell"
                role="button"
                onClick={e => {
                  e.stopPropagation()
                  toggleAtom(x, y)
                }}
              >
                {cell.map((indicator, i) =>
                  <Indicator
                    key={i}
                    scanPairs={scanPairs}
                    scan={scan}
                    inputValue={indicator}
                  />
                )}
                <div
                  className="atom"
                  hidden={!suggestion.some(s => s.x === x && s.y === y)}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Board