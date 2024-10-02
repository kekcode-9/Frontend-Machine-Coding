import { NextResponse, NextRequest } from "next/server";
import { PostType, AllPostsType } from "@/types";

let allPosts: AllPostsType = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageNumber = searchParams.get("page");

  let targetURL = "https://jsonplaceholder.typicode.com/posts";

  if (!pageNumber) {
    /**
     * pageNumber will not be provided when the GET method is called from layout.tsx
     * this is where we fetch the entire json data and store it as pages
     */
    const res = await fetch(targetURL);
    if (res.ok) {
      const result = await res.json();

      // arrange the posts into 10 posts per page
      const postsPerPage = 10;
      let currPage = 0;

      Object.values(result).map((post, i) => {
        allPosts[currPage] = {
          ...allPosts[currPage],
          [(i % postsPerPage) + (currPage * 10)]: {
            userId: (post as PostType).userId,
            id: (post as PostType).id,
            title: (post as PostType).title,
            body: (post as PostType).body,
          },
        };

        if (i % postsPerPage === postsPerPage - 1) {
          // increment currPage by 1 when 10 posts have been stored in current page
          currPage++;
        }
      });

      console.log("allPosts: ", allPosts);

      return NextResponse.json(allPosts);
    } else {
      console.log("call failed: ", res);
      return NextResponse.json({ message: "failure" });
    }
  } else {
    // no need to fetch. Just send the stored data
    console.log(`allPosts[parseInt(pageNumber)]: `, allPosts[parseInt(pageNumber)]);
    return NextResponse.json(allPosts[parseInt(pageNumber)]);
  }
}
