import { useQuery, useMutation } from "@tanstack/react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const { data, isLoading, isError, error } = useQuery(
    ["comments", post.id],
    () => fetchComments(post.id)
  );

  const deleteMutation = useMutation((postId) => deletePost(postId));
  const updateMutation = useMutation((postId) => updatePost(postId));

  if (isLoading) return <h3>Loading...</h3>;

  if (isError)
    return (
      <h3>
        Oops, something went wrong.
        <p>{error}</p>
      </h3>
    );

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isLoading && (
        <p style={{ color: "purple" }}>Deleting the post</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: "green" }}>Post has been deleted</p>
      )}
      {deleteMutation.isError && (
        <p style={{ color: "red" }}>Error deleting the post</p>
      )}

      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>

      {updateMutation.isLoading && (
        <p style={{ color: "purple" }}>Update the post</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: "green" }}>Post has been updated</p>
      )}
      {updateMutation.isError && (
        <p style={{ color: "red" }}>Error updating the post</p>
      )}

      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
