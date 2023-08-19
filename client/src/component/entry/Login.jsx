import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [invalid, setinvalid] = useState(false);

  const navigate = useNavigate();
  const login_user = async () => {
    if (email && password) {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const res_Data = await res.json();
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res_Data));
        navigate("/");
        window.location.reload();
      }
    }
  };

  useLayoutEffect(() => {
    const Auth_cheack = async () => {
      try {
        const res = await fetch("http://localhost:8080/new-post-auth", {
          method: "GET",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        });
        if (res.status == 200) {
          navigate(-1);
        }
      } catch (err) {
        console.log(err);
      }
    };
    Auth_cheack();
  });

  return (
    <>
      <div className="mt-20 md:w-96 flex flex-col md:m-auto md:mt-40 p-5 gap-5">
        {invalid ? (
          <p className="text-red-500">Credentials invalid, try again.</p>
        ) : (
          ""
        )}
        <input
          value={email}
          onChange={(e) => setemail(e.target.value)}
          className="bg-gray-200 outline-purple-800 h-8 rounded-md pl-2"
          type="text"
          name="email"
          id="email"
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          className="bg-gray-200 outline-purple-800 h-8 rounded-md pl-2"
          type="text"
          name="password"
          id="password"
          placeholder="Password"
        />
        <button
          onClick={() => login_user()}
          className="bg-purple-700 h-9 text-white text-xl rounded-md active:bg-purple-500"
        >
          Login
        </button>
      </div>
    </>
  );
}
