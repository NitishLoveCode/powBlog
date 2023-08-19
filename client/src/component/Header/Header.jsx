import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Link, json } from 'react-router-dom'

export default function Header() {
  const [allowNewpost, setallowNewpost]=useState(false)
  const [userinfo,setuserinfo] = useState(null)

  

  const userData= JSON.parse(localStorage.getItem("user"))
  
  useEffect(()=>{
    setTimeout(() => {
      if(userData){
          setuserinfo(userData)
          setallowNewpost(true)
        }
    }, 1000);
  },[])



  const logout=async()=>{
    localStorage.removeItem("user")
    const data= await fetch("http://localhost:8080/logout",{
      method: "GET",
      credentials:"include",
      headers: {
        "content-type":"application/json"
      }
    })
    console.log(await data.json())
    if(data.status === 200){
      window.location.reload()
    }
  }


  return (
    <>
      <div className='bg-purple-700 fixed top-0 text-white flex justify-around items-center h-10 w-full'>
        <div className="active:text-blue-400 text-2xl font-bold"><Link to={"/"}>PowBlog</Link></div>
        <div className="flex gap-4 md:gap-16">
          {
            userinfo? userinfo.name.toUpperCase() :<Link className='cursor-pointer active:text-blue-400' to="/login">Login</Link>
          }
  
          {
            allowNewpost ? <Link className='cursor-pointer active:text-blue-400' to="/new-post">Create Post</Link>:<Link className='cursor-pointer active:text-blue-400' to="/register">Register</Link>
          }
          {
            userinfo? <button onClick={()=>logout()}>Log Out</button>:""
          }
          
        </div>
      </div>
    </>
  )
}
