import Head from "next/head"

import Game from "@/components/Game"


export default function SinglePlayer() {
  return (
    <>
      <Head>
        <title>Одиночная игра</title>
      </Head>
      <main
        className={"flex min-h-screen flex-col items-center justify-center"}
      >
        <Game />
      </main>
    </>
  )
}
