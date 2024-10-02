## Requirement
1. Fetch large dataset from api and lazy load them as the user scrolls down
2. Create an infinite scroll feature until user reaches the end of the list of fetched data
3. Try to keep the use of effects to a minimum

## Solution
### Broad idea
1. Use pagination in the API
2. Use react-intersection-observer to check when the bottom of the page is reached
4. When the bottom of page is reached, load the next page from the api

This way we don't have to fetch the entire API data (which can be huge) to the client side at once.
Instead we can fetch the next chunk of data once user reaches the end of the current chunk.

### Pagination
We are using the [JSON Placeholder posts API](https://jsonplaceholder.typicode.com/posts) which does not provide any pagination feature. Although the number of results is only 100, for any other API this could easily become much larger.

Our plan is to:
1. Create our own API route in Next.js where we will fetch the entire API data at the very beginning. This being in server, the client side won't feel the load of this fetch.
2. On the layout.tsx file we import and call the GET method from app/api/posts/route.tsx like we would call a normal function since both layout.tsx and the route.tsx file are in the server.
3. Inside the GET call (app/api/posts/route.tsx), once the data is fetched, we immediately paginate it with 10 posts per page.
4. We store this paginated data inside a variable called **allPosts** of type **AllPostsType** ( find it in types.d.ts ), from where we serve the posts from each page to client based on the page number passed in the search parameter.

Data structure for posts in our server: <br/>
{ <br/>
&nbsp;0: { <br/>
&nbsp;&nbsp;1: { <br/>
&nbsp;&nbsp;&nbsp;...post content <br/>
&nbsp;&nbsp;}, <br/>
&nbsp;&nbsp;2: { <br/>
&nbsp;&nbsp;&nbsp;...post content <br/>
&nbsp;&nbsp;}, <br/>
&nbsp;&nbsp;... <br/>
&nbsp;&nbsp;9: { <br/>
&nbsp;&nbsp;&nbsp;...post content <br/>
&nbsp;&nbsp;} <br/>
&nbsp;}, <br/>
&nbsp;1: { <br/>
&nbsp;&nbsp;10: { <br/>
&nbsp;&nbsp;&nbsp;...post content <br/>
&nbsp;&nbsp;}, ... <br/>
&nbsp;}, ... <br/>
} <br/>

Notice that we do not start over the post keys from 0 for each page, instead we maintain the actual no. of the posts among the enitre list of posts. This is because we will not be showing just one page worth of posts ( 10 posts ) in the UI at a time. Instead, as user scrolls down, the no. of posts shown will keep growing. If each page stores its posts using keys from 0 to 9 then when we add a new set of posts to our react state for posts, those new post keys, being the same ( 0 to 9 ) as the old ones, would overwrite the old posts and we will inadvertently end up removing the older posts from our UI.

## Infinite scroll on the UI
1. We create a transparent div at the bottom of the page
2. Use react-intersection-observer and use the bottom div as the observer's target with a threshold of 1 so the inView is true only when the entire bottom div is visible
3. The onChange api of react-intersection-observer's useInView hook will get triggered on change of visibility of the bottom div.
4. Inside onChange, we check if inView is true and if so, we fetch the next page of posts from our posts api route in our Next.js server.
