export type PostType = {
    userId: number,
    id: number,
    title: string,
    body: string
}

export type AllPostsType = {
    [key: string]: PostType // the key depicts the post no. among all posts and not just in the page
}