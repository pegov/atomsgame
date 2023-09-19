import { FC } from "react"


interface Props {
	errorMessage: string
}

const ErrorAlert: FC<Props> = ({ errorMessage }) => {
  return (
    <div className="mt-4" role="alert">
      <div className="bg-red-500 text-white text-center font-bold rounded-t px-4 py-2">
				Ошибка
      </div>
      <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
        <p>{errorMessage}</p>
      </div>
    </div>
  )
}

export default ErrorAlert