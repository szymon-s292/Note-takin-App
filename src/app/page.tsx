'use server'
import Dashboard from "@/components/ui/Dashboard";
import NoteEditor from "@/components/ui/note-editor";

import Image from "next/image";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if(!session) redirect('/login')

  const response = await fetch(`http://localhost/note-app/api/v1/load-notes.php?user_id=${session.user.id}`)
  const data = await response.json()

  return (
    <div className="grid-layout">
      <div className="navigation bg-[#FAF3E0] rounded-xl border-2 flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Image src={"/note.png"} width={60} height={60} alt="edit-icon"/>
          <p className="title ml-4 text-[15x] md:text-[30px] whitespace-nowrap transition-all duration-300 ease-in-out">Note-taking App</p>
        </div>
        <Dashboard/>
      </div>

      <Suspense fallback={<h1>Loading...</h1>}>
        <NoteEditor initialNotes={data['data']}></NoteEditor>
      </Suspense>
    </div>
  );
}