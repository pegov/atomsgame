import Link from "next/link"
import Head from "next/head"


export default function Home() {
  return (
    <>
      <Head>
        <title>Игра Атомы</title>
      </Head>
      <main
        className={"flex min-h-screen flex-col items-center justify-center p-12"}
      >
        <div className="my-2 menu-link">
          <Link href="/singleplayer">Одиночная игра</Link>
        </div>
        <div className="my-2 menu-link">
          <Link href="/tutorial">Инструкция</Link>
        </div>
      </main>
    </>
  )
}