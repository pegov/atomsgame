import { useEffect, useRef, useState } from "react"

import Board from "./Board"

import { Coord, ScanRequest, ServerMessage, SuggestRequest } from "@/types/game"


const Game = () => {
  const wsRef = useRef<WebSocket | null>(null)

  const [scanPairs, setScanPairs] = useState<number[][]>([])
  const [suggestion, setSuggestion] = useState<Coord[]>([])
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new WebSocket("ws://127.0.0.1/ws/games")
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
      case "scan": {
        setScanPairs(v => [...v, [message.input, message.output]])
        break
      }
      case "suggest": {
        setSuccess(message.success)
        break
      }
      case "error": {
        // TODO:
      }
      default:
        console.log(message)
    }
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
    if (!suggestion.some(s => s.x === x && s.y === y)) {
      setSuggestion(v => [...v, { x, y }])
    } else {
      setSuggestion(v => v.filter(s => !(s.x === x && s.y === y)))
    }
  }

  return (
    <>
      <Board
        scanPairs={scanPairs}
        scan={scan}
        suggestion={suggestion}
        toggleAtom={toggleAtom}
      />
      <div className="text-center">
        <p>4 ATOMS</p>
        <button className="border-2 border-black" onClick={suggest}>SUGGEST</button>
        <p>{success ? "YES" : "NO"}</p>
      </div>
    </>
  )
}

export default Game