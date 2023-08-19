import React, { useEffect, useLayoutEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

export default function NewPost() {
  const navigate = useNavigate();
  const { editId } = useParams();
  console.log(editId);
  const [title, settitle] = useState("");
  const [discription, setdiscription] = useState("");
  const [content, setcontent] = useState("");
  const [Thumbnail, setthumbnail] = useState();
  const [updatedImd, setupdatedImd] = useState('')

  // ---------chacking useer auth to write post--------------
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
        if (res.status !== 200) {
          navigate(-1);
        }
      } catch (err) {
        console.log(err);
      }
    };
    Auth_cheack();
  });
  // ------------------------end--------------------------

  const Grabing_Thumbnail = (e) => {
    setthumbnail(e.target.files[0]);
  };

  // --------------------------now sending createing post---------------
  const create_new_post = async (e) => {
    // GATTING USER ID------------------------
    const user_id = JSON.parse(localStorage.getItem("user"));

    // --------------------------------
    const Data = new FormData();
    Data.set("title", title);
    Data.set("discription", discription);
    Data.set("content", content);
    Data.set("user_id", user_id.id);
    Data.set("user_name", user_id.name);
    Data.set("Thumbnail", Thumbnail);
    console.log(Data);
    e.preventDefault();

    const res = await fetch("http://localhost:8080/new-post", {
      method: "POST",
      credentials: "include",
      body: Data,
    });
    const responce_Data = await res.json();

  };

  // ----------------------eaditing code is here--------------------------
  useEffect(() => {
    if(editId!==undefined){
      try{
        const edit_data_fatch=async() => {
          const edit_data=await fetch("http://localhost:8080/edit-post",{
            method:"POST",
            credentials:"include",
            headers:{
              "content-type": "application/json",
            },
            body:JSON.stringify({
              editId
            })
          })
          const eadit_data_response = await edit_data.json();
          if(edit_data.status===401){
            navigate(-1)
          }
          if(edit_data.status===200){
            settitle(eadit_data_response.title)
            setdiscription(eadit_data_response.description)
            setcontent(eadit_data_response.content)
            setupdatedImd(eadit_data_response.thumbnail)
            
          }
        }
        edit_data_fatch()

      }catch(err){
        console.log(err);
      }
    }
  }, []);

  // ---------------style and background image of upload images---------------
  // const backgroundImage = `style={{backgroundPosition:"center", backgroundImage:`url(${updatedImd})}`}
  
  // --------------------------------eaditing code is here------------------

  return (
    <>
      <form onSubmit={create_new_post}>
        <div className="p-4 mt-5 md:flex md:gap-3 justify-center items-center">
          <div>
            <input
              className="w-full bg-purple-200 p-1 rounded-md outline-purple-500 mt-4"
              type="text"
              name="title"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />
            <br />
            <input
              className="w-full mb-3 bg-purple-200 p-1 rounded-md outline-purple-500 mt-4"
              type="text"
              name="description"
              id="description"
              placeholder="Description"
              value={discription}
              onChange={(e) => setdiscription(e.target.value)}
            />
            <ReactQuill
              onChange={(newValue) => setcontent(newValue)}
              modules={modules}
              value={content}
              theme="snow"
              placeholder="Content goes here..."
            />
          </div>
          <div className="mt-4  md:w-80 flex flex-col gap-3">
            <p className="text-xl  mt-10">Upload Thumbnail</p>
            {
              editId? <label 
              className="bg-purple-400 cursor-pointer border-2 border-indigo-600  w-full h-40 rounded-md text-2xl flex
            items-center justify-center text-gray-50 "
              htmlFor="file" 
            >
              {editId? "Change" : "Upload"}
            </label>:<label
              className="bg-purple-400 cursor-pointer border-2 border-indigo-600  w-full h-40 rounded-md text-2xl flex
            items-center justify-center text-gray-50 "
              htmlFor="file" 
            >
              {editId? "Change" : "Upload"}
            </label>
            }
            <input
              onChange={Grabing_Thumbnail}
              className="hidden"
              type="file"
              name="file"
              id="file"
            />
            <button className="bg-purple-600 text-white h-10 rounded-md text-xl">
              {editId? "Update" : "Post"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
