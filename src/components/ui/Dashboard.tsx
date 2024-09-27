'use client'
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"

export default function Dashboard() {
  const { data: session } = useSession();
  return (
    <div className="flex items-center space-x-3">
      <div className="flex flex-col text-end">
        <h1 className="text-nowrap">Welcome back, {session?.user?.name}</h1>
        <p className="text-xs">{session?.user?.email}</p>
      </div>
      <button onClick={() => signOut()} className="rounded-xl h-11 w-11 flex justify-center items-center bg-red-500">
       <Image src="/logout.svg" width={25} height={25} alt="edit-icon"></Image>
      </button>
    </div>
  )
}