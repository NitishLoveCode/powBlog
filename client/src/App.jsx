import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/Header/Header";
import Home from "./component/Home/Home";
import Login from "./component/entry/Login";
import Register from "./component/entry/Register";
import NewPost from "./component/CreatePost/NewPost";
import Postpage from "./component/singlePost/Postpage";

export default function App() {
  
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/new-post" element={<NewPost/>}/>
          <Route path="/post/:id" element={<Postpage/>}/>
          <Route path="/edit/:editId" element={<NewPost/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

