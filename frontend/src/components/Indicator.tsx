import { FC } from "react"


interface Props {
  scanPairs: number[][]
	scan: (n: number) => void
	inputValue: number
}

const Indicator: FC<Props> = ({ scanPairs, scan, inputValue }) => {
  const pair = scanPairs.find(p => p[0] === inputValue)
  const outputValue = pair ? pair[1] : null

  return (
    <div
      className="indicator"
      onClick={e => {
        e.stopPropagation()
        scan(inputValue)
      }}
    >
      {outputValue ? `${inputValue}(${outputValue})` : inputValue}
    </div>
  )
}

export default Indicator