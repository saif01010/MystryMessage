'use client'
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import Link from "next/link"
import { Button } from "./ui/button"


 const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <Link className='text-xl font-bold ml-0 ' href="/dashboard">Mystry Message</Link>
            {session ?(<>
            <span className="mr-4">{user.username || user.email}</span>
            <Button onClick={()=>(signOut())} className=" w-full md:w-auto bg-slate-300 text-black" variant={'outline'}>LogOut</Button></>)
            :(<Link href='sign-in'>
                <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
            </Link>)
            }
        </div>
    </nav>
  )
}

export default Navbar;
