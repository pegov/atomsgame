import Image from "next/image"
import Link from "next/link"
import { FC } from "react"


interface Props {
  text: string
  imgSrc: string
}

const Example: FC<Props> = ({ text, imgSrc }) => {
  return (
    <>
      <p className="text-center">{text}</p>
      <div className="flex justify-center p-2">
        <Image
          className="tutorial-image"
          src={imgSrc}
          width={0}
          height={0}
          sizes="100vh"
          alt="..."
        />
      </div>
    </>
  )
}

const Tutorial = () => {
  return (
    <>
      <div className="w-full" role="alert">
        <div className="text-xl tutorial-block">
          <h1 className="text-2xl text-center">Инструкция</h1>
          <p className="tutorial-p">Поле состоит из клеток и пересечений.</p>
          <p className="tutorial-p">В клетках располагаются атомы. Для игрока они невидимы.</p>
          <p className="tutorial-p">По границам поля есть числа, из которых по линиям между клетками пускаются лучи.</p>
          <p className="tutorial-p">Лучи взаимодействуют с атомами, расположенными в клетках и, выходя за пределы поля, попадают на другое или на то же число.</p>
          <p className="tutorial-p">Число, на которое попал луч, записывается в скобках рядом с начальным числом.</p>
          <p className="tutorial-p">Цель игры - угадать все клетки, в которых находятся атомы.</p>
          <p className="tutorial-p">{"Для этого нужно нажать на клетки, где по вашему предположению находятся атомы, затем нажать на кнопку \"Отправить\". Результат вашей попытки покажется ниже под кнопкой."}</p>
        </div>
        <div className="text-xl tutorial-block">
          <h1 className="text-2xl text-center">Примеры</h1>
          <Example
            text={"Луч выходит из цифры 20, попадает на угол клетки с атомом и приходит в цифру 2."}
            imgSrc="/tutorial/1.png"
          />
          <Example
            text={"Луч выходит из цифры 18, одновременно попадает на угол двух клеток с атомами и возвращается обратно."}
            imgSrc="/tutorial/2.png"
          />
          <Example
            text={"Луч выходит из цифры 20, сразу попадает на угол клетки с атомом и приходит в цифру 1."}
            imgSrc="/tutorial/3.png"
          />
          <Example
            text={"Луч выходит из цифры 17, последовательно попадает на 3 разных клетки с атомами и приходит в цифру 14."}
            imgSrc="/tutorial/4.png"
          />
          <Example
            text={"Пример выигрыша."}
            imgSrc="/tutorial/5.png"
          />
        </div>
      </div>
      <div className="flex my-5">
        <div className="my-2 mx-auto menu-link">
          <Link href="/">Обратно</Link>
        </div>
      </div>
    </>
  )
}

export default Tutorial