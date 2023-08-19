import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Postpage() {
    const {id}=useParams()
    const[post,setpost]=useState(null)
    const[dellayHandle,setdellayHandle]=useState("Loading...")

    useEffect(()=>{
        const fetch_post=async()=>{
            const post=await fetch(`http://localhost:8080/single-post`,{
                method: 'POST',
                credentials:"include",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    id
                })
            })
            const post_Data=await post.json();
            console.log(post.status)
            if(post.status===200){
                setpost(post_Data);
            }
            if(post.status===404){
                setdellayHandle("404 Page could not be found.")
            }
            console.log(post_Data)
        }
        fetch_post()
    },[])

  return (
    <>
      <div className="mt-16 text-center md:mt-20 md:w-2/3 md:ml-auto md:mr-auto p-1 md:flex md:flex-col md:justify-center ">
        {post===null? <h1 className="text-3xl">{dellayHandle}</h1> :<><h1 className="text-2xl font-medium text-justify">
          {post?.title}
        </h1>
        <div className="text-gray-400 gap-4 flex">
            <span>By: {post?.user_name.toUpperCase()}</span>
            <span>Posted at: {post?.created.slice(0,10)}</span>
        </div>
        <div className="bg-gray-300 w-full h-40 rounded-md mt-3 overflow-hidden">
          <img
            className="object-cover"
            src={`http://localhost:8080/${post?.thumbnail.replace("./","")}`}
            alt="here, should be title"
          />
        </div>
        <div className="text-justify mt-6 mb-10"
        dangerouslySetInnerHTML={{__html: post?.content}}>
        </div></>}
      </div>
    </>
  );
}
