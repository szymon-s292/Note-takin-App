'use client'
import { useState } from "react";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import Image from 'next/image';

export default function LoginForm()
{
  const {data: session} = useSession();
  const router = useRouter();

  if(session) router.push('/')

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/')
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#F0F4F8] box-border text-slate-800">

      <div className="flex items-center flex-col bg-[#FAF3E0] p-10 gap-2 border-2 rounded-2xl">
        <header className="text-3xl font-medium ">Sign in</header>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5 mt-5">
            <div>
              <label htmlFor="input-email">Email<br />
                <input type="email" id="input-email" value={email} className="p-2 outline-none rounded-md"
                  onChange={(e) => setEmail(e.target.value)}/>
              </label>
            </div>
            <div>
              <label htmlFor="input-password">Password<br />
                <input type="password" id="input-password" value={password} className="p-2 outline-none rounded-md"
                  onChange={(e) => setPassword(e.target.value)}/>
              </label>
            </div>
            {error && <p className="text-sm text-center bg-red-500 text-white py-1 px-4 rounded shadow-md hover:bg-red-600 focus:outline-none w-full">{error}</p>}
            <button onClick={() => {}} type="submit" className="text-lg bg-blue-500 text-white py-1 px-4 rounded shadow-md hover:bg-blue-600 focus:outline-none w-full">Login</button>
          </div>
        </form>

        <p className="font-medium text-xl my-2">or</p>
        <div className="flex justify-between flex-col text-sm gap-y-2">
          {/* <button onClick={() => signIn('google')}>Sign in with Google</button> */}
          {/* <button onClick={() => signIn('github')}>Sign in with Github</button> */}
        

          <button onClick={() => signIn('github')} 
              className="px-4 py-2 border flex gap-2 bg-white border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 hover:text-slate-900 dark:hover:text-slate-500 hover:shadow transition duration-150">
              <Image 
                  src="/github.svg" 
                  width={24} 
                  height={24} 
                  alt="github logo" 
                  className="w-6 h-6" 
              />
              <span>Login with Github</span>
          </button>

          <button onClick={() => signIn('google')} 
              className="px-4 py-2 border flex gap-2 bg-white border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 hover:text-slate-900 dark:hover:text-slate-500 hover:shadow transition duration-150">
              <Image 
                  src="/google.svg" 
                  width={24} 
                  height={24} 
                  alt="google logo" 
                  className="w-6 h-6" 
              />
              <span>Login with Google</span>
          </button>


        </div>
      </div>
    </div>
  )
}