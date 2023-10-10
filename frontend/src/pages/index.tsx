import Link from "next/link"


export default function Home() {
  return (
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
  )
}