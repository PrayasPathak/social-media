import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import { getAllPosts } from "@/api/postService";
import { setPosts, setPostLoading, setPostError } from "@/redux/postSlice";

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.post);

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(setPostLoading(true));
      const res = await getAllPosts();
      if (!res.error) {
        dispatch(setPosts(res.data));
      } else {
        dispatch(setPostError(res.error));
        console.log(res.error);
      }
      dispatch(setPostLoading(false));
    };

    fetchPosts();
  }, [dispatch]);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  // console.log(posts);

  return (
    <div>
      {posts.length === 0 && <p>No posts found.</p>}
      {posts
        .filter((post) => post !== null && post !== undefined)
        .map((post) => (
          <Post key={post.id} post={post} />
        ))}
    </div>
  );
};

export default Posts;
