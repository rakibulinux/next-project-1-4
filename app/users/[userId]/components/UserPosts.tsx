type Props = {
  promise: Promise<Post[]>;
};

export default async function UserPosts({ promise }: Props) {
  const posts = await promise;
  const content = posts.map((post) => {
    return (
      <>
        <article>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </article>
      </>
    );
  });
  return content;
}
