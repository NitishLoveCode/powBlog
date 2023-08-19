import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [all_posts, setall_posts] = useState([]);

  const find_all_posts = async () => {
    try {
      const res = await fetch("http://localhost:8080/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
      const getData = await res.json();
      setall_posts(getData);
      console.log(getData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    find_all_posts();
  }, []);
  {
  }
  return (
    <>
      <div className="mt-14 md:mt-28 md:ml-16">
        {all_posts.map((curElement, i) => {
          return (
            <>
              <Link to={`/post/${curElement?._id}`}>
                <div
                  key={Math.floor(Math.random() * 99) + 1}
                  className="flex p-2 gap-3 md:items-center"
                >
                  <div
                    key={Math.floor(Math.random() * 45) + 1}
                    className="bg-gray-500 h-24 w-40 overflow-hidden rounded-md sm:w-40 sm:h-40 md:w-48 md:h-40"
                  >
                    <img
                      className="w-full h-full rounded-md"
                      src={`http://localhost:8080/${curElement?.thumbnail.replace(
                        "./",
                        ""
                      )}`}
                      alt={curElement?.title}
                      key={Math.floor(Math.random() * 870) + 1}
                    />
                  </div>
                  <div
                    key={Math.floor(Math.random() * 1000) + 1}
                    className="right_info"
                  >
                    <div
                      key={Math.floor(Math.random() * 1000) + 1}
                      className="title"
                    >
                      {curElement?.title.slice(0, 55)}..
                    </div>
                    <p
                      key={Math.floor(Math.random() * 170) + 1}
                      className="text-sm"
                    >
                      <span
                        key={Math.floor(Math.random() * 9) + 1}
                        className="text-purple-400"
                      >
                        {curElement?.user_name}
                      </span>
                      <span
                        key={Math.floor(Math.random() * 550) + 1}
                        className="text-gray-500"
                      >
                        {curElement?.created.slice(0, 9520)}
                      </span>
                    </p>
                    <div
                      key={Math.floor(Math.random() * 7700) + 1}
                      className="discription"
                    >
                      <p
                        key={Math.floor(Math.random() * 9900) + 1}
                        className="text-sm text-gray-500"
                      >
                        {curElement?.description.slice(0, 50)}...
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </>
          );
        })}
      </div>
    </>
  );
}
