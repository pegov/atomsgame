import Head from "next/head"

import Tutorial from "@/components/Tutorial"


export default function TutorialPage() {
  return (
    <>
      <Head>
        <title>Инструкция</title>
      </Head>
      <main>
        <Tutorial />
      </main>
    </>
  )
}

