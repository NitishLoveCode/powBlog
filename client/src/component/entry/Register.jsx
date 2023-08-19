import React, {useLayoutEffect,  useState } from "react";
import { json, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [passVal, setpassVal] = useState(false);


  const navigate = useNavigate();

  const register_user = async () => {
    if (name && email && password && cpassword) {
      if (password === cpassword) {
        const res = await fetch("http://localhost:8080/register", {
          method: "POST",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });
        const res_Data = await res.json();
        localStorage.setItem("user", JSON.stringify(res_Data));
        if (res.status === 200) {
          window.location.reload();
          navigate("/");
        }
      } else {
        setpassVal(true);
      }
    }
  };
  // ----------------SEND TO HOME IF ALREADY LOGIN OR REGISTER-------------------
  useLayoutEffect(()=>{
      const Auth_cheack=async()=>{
        try{
          const res=await fetch("http://localhost:8080/new-post-auth",{
            method: "GET",
            credentials:"include",
            headers:{
              "content-type": "application/json"
            }
          })
          if(res.status==200){
            navigate(-1)

          }
        }catch(err){
          console.log(err)
        }
      }
      Auth_cheack();
  })
  return (
    <>
      <div className="mt-20 md:w-96 flex flex-col md:m-auto md:mt-40 p-5 gap-5">
        <input
          value={name}
          onChange={(e) => setname(e.target.value)}
          className="bg-gray-200 placeholder-gray-600 outline-purple-800 h-8 rounded-md pl-2"
          type="text"
          name="name"
          id="name"
          placeholder="Name"
        />
        <input
          value={email}
          onChange={(e) => setemail(e.target.value)}
          className="bg-gray-200 placeholder-gray-600 outline-purple-800 h-8 rounded-md pl-2"
          type="text"
          name="email"
          id="email"
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          className="bg-gray-200 placeholder-gray-600 outline-purple-800 h-8 rounded-md pl-2"
          type="text"
          name="password"
          id="password"
          placeholder="Password"
        />
        <input
          value={cpassword}
          onChange={(e) => setcpassword(e.target.value)}
          className="bg-gray-200 placeholder-gray-600 outline-purple-800 h-8 rounded-md pl-2"
          type="text"
          name="Cpassword"
          id="Cpassword"
          placeholder="Conform Password"
        />
        {passVal ? (
          <p className="text-red-500">Password not match try again</p>
        ) : (
          ""
        )}
        <button
          onClick={() => register_user()}
          className="font-bold bg-purple-700 h-9 text-white text-xl rounded-md active:bg-purple-500"
        >
          Login
        </button>
      </div>
    </>
  );
}
