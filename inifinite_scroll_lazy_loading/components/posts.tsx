"use client";
import React, {
  useCallback,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import { AllPostsType } from "@/types";

export default function Posts() {
  const [posts, updatePosts] = useState<AllPostsType>();
  const [page, updatePage] = useState<number>(-1);

  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (inView) {
        fetchNextPage();
      }
    },
  });

  const fetchNextPage = useCallback(() => {
    const nextPage = page + 1;
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/posts/?` +
        new URLSearchParams({
          page: `${nextPage}`,
        }),
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        updatePosts({
          ...posts,
          ...res,
        });
        updatePage(nextPage);
      })
      .catch((err) => {
        console.log("error is: ", err);
      });
  }, [page, posts]);

  return (
    <div
      className="flex flex-col gap-12 items-center
      w-full
      py-5 sm:py-8
      bg-slate-400"
    >
      {posts &&
        Object.values(posts).map((post, i) => {
          const { title, body, id } = post;
          return (
            <div
              key={i}
              className="
              w-[96vw] sm:w-[88vw] lg:w-[30vw] h-fit 
              p-8 
              bg-slate-300 text-slate-700
              rounded-md"
            >
              <div>Post - {id}</div>
              <div className="pt-4">
                <b>Title: </b> {title}
              </div>
              <div className="pt-4">
                <b>Body: </b> {body}
              </div>
            </div>
          );
        })}
      <div
        ref={ref}
        className="observer-target
          w-full h-[1rem]"
      />
    </div>
  );
}
