import { useEffect, useRef, useState } from "react"

import Board from "./Board"

import {
  Coord,
  ScanRequest,
  ServerMessage,
  Settings,
  StartRequest,
  SuggestRequest,
} from "@/types/game"


enum Route {
  Settings = "settings",
  Game = "game"
}

const Game = () => {
  const wsRef = useRef<WebSocket | null>(null)
  const successTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [route, setRoute] = useState<Route>(Route.Settings)
  const [settings, setSettings] = useState<Settings>({ sizeX: 4, sizeY: 4, atomsCount: 4 })
  const [scanPairs, setScanPairs] = useState<number[][]>([])
  const [suggestion, setSuggestion] = useState<Coord[]>([])
  const [success, setSuccess] = useState<boolean | undefined>()

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new WebSocket(`${process.env.ORIGIN_WS}/ws/games`)
      const ws = wsRef.current
      ws.onopen = () => {
        console.log("ws open event")
      }
      ws.onclose = () => {
        console.log("ws close event")
      }
      ws.onmessage = event => {
        console.log(event.data)
        handleMessage(event.data)
      }
    }

    return () => {
      // if (wsRef.current) wsRef.current.close()
    }
  }, [])

  const handleMessage = (data: string) => {
    const message: ServerMessage = JSON.parse(data)
    switch (message.type) {
      case "start": {
        setScanPairs([])
        setSuggestion([])
        setSuccess(undefined)
        setSettings(message.settings)
        setRoute(Route.Game)
        break
      }
      case "scan": {
        setScanPairs(v => [...v, [message.input, message.output]])
        break
      }
      case "suggest": {
        setSuccess(message.success)
        if (message.success) {
          if (successTimeoutId.current) {
            clearTimeout(successTimeoutId.current)
          }
        } else {
          if (successTimeoutId.current) {
            clearTimeout(successTimeoutId.current)
          }
          successTimeoutId.current = setTimeout(() => {
            if (!success) {
              setSuccess(undefined)
            }
            successTimeoutId.current = null
          }, 2000)
        }
        break
      }
      case "error": {
        // TODO:
        break
      }
      default:
        console.log(message)
    }
  }

  const startNewGame = (): void => {
    if (!wsRef.current) return

    const ws = wsRef.current
    const message: StartRequest = {
      type: "start",
      settings,
    }
    ws.send(JSON.stringify(message))
  }

  const changeSettings = (): void => {
    setRoute(Route.Settings)
  }

  const scan = (n: number): void => {
    if (!wsRef.current) return

    for (let i = 0; i < scanPairs.length; i++) {
      if (scanPairs[i][0] === n) {
        return
      }
    }

    const ws = wsRef.current
    const message: ScanRequest = {
      type: "scan",
      input: n,
    }
    ws.send(JSON.stringify(message))
  }

  const suggest = (): void => {
    if (!wsRef.current) return

    const ws = wsRef.current
    const message: SuggestRequest = {
      type: "suggest",
      coords: suggestion,
    }
    ws.send(JSON.stringify(message))
  }

  const toggleAtom = (x: number, y: number) => {
    if (!suggestion.some(s => s.x === x && s.y === y) && suggestion.length < settings.atomsCount) {
      setSuggestion(v => [...v, { x, y }])
    } else {
      setSuggestion(v => v.filter(s => !(s.x === x && s.y === y)))
    }
  }

  if (route === Route.Settings) {
    return (
      <>
        <div className="my-1">
          <label className="block" htmlFor="x">Размер по горизонтали</label>
          <input
            type="number"
            name="x"
            id="x"
            value={settings.sizeX}
            onChange={e =>
              setSettings(settings => ({
                ...settings,
                sizeX: parseInt(e.target.value),
              }))
            }
          />
        </div>
        <div className="my-1">
          <label className="block" htmlFor="y">Размер по вертикали</label>
          <input
            type="number"
            name="y"
            id="y"
            value={settings.sizeY}
            onChange={e =>
              setSettings(settings => ({
                ...settings,
                sizeY: parseInt(e.target.value),
              }))
            }
          />
        </div>
        <div className="my-1">
          <label className="block" htmlFor="count">Число атомов</label>
          <input
            type="number"
            name="count"
            id="count"
            value={settings.atomsCount}
            onChange={e =>
              setSettings(settings => ({
                ...settings,
                atomsCount: parseInt(e.target.value),
              }))
            }
          />
        </div>
        <div className="mt-4">
          <button className="button-custom w-full" onClick={startNewGame}>СТАРТ</button>
        </div>
      </>
    )
  }

  if (route === Route.Game) {
    const atomsRemain = settings.atomsCount - suggestion.length

    return (
      <>
        <Board
          settings={settings}
          scanPairs={scanPairs}
          scan={scan}
          suggestion={suggestion}
          toggleAtom={toggleAtom}
        />
        <div className="text-center mt-10">
          <div>
            <button
              className="button-custom my-2"
              onClick={suggest}
              disabled={atomsRemain > 0}
            >
              {atomsRemain > 0
                ? `АТОМОВ ОСТАЛОСЬ: ${atomsRemain}`
                : "ОТПРАВИТЬ"}
            </button>
            <p>
              {success !== undefined ? success ? "ПОБЕДА" : "НЕВЕРНО" : null}
            </p>
          </div>
          <div>
            <button className="button-custom my-2 mx-2" onClick={startNewGame}>
              РЕСТАРТ
            </button>
            <button
              className="button-custom my-2 mx-2"
              onClick={changeSettings}
            >
              НАСТРОЙКИ
            </button>
          </div>
        </div>
      </>
    )
  }
}

export default Game