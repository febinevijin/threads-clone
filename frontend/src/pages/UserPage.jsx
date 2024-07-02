import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useRecoilState(postsAtom);
  // const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const res = await fetch(`/api/user/post-page/${id}`);
  //       const data = await res.json();
  //       if (data.error) {
  //         showToast("Error", data.error, "error");
  //         return;
  //       }
  //       if (data.success === false && data.status === "failure") {
  //         showToast("Error", data.message, "error");
  //         return;
  //       }
  //       // if (data.isFrozen) {
  //       //   setUser(null);
  //       //   return;
  //       // }
  //       setUser(data.data);
  //     } catch (error) {
  //       showToast("Error", error.message, "error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   const getPosts = async () => {
  //     if (!user) return;
  //     setFetchingPosts(true);
  //     try {
        
  //       const res = await fetch(`/api/post/user-post`);
  //       const data = await res.json();
  //       console.log(data.data, "dsdfsfsfsdfsd");
  //       setPosts(data.data);
  //     } catch (error) {
  //       showToast("Error", error.message, "error");
  //       setPosts([]);
  //     } finally {
  //       setFetchingPosts(false);
  //     }
  //   };
  //   getUser();
  //   getPosts();
  // }, [id, showToast,]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/post-page/${id}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        if (data.success === false && data.status === "failure") {
          showToast("Error", data.message, "error");
          return;
        }
        setUser(data.data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id, showToast]);

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/post/user-post`);
        const data = await res.json();
        console.log(data.data, "Fetched posts");
        setPosts(data.data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    if (user) {
      getPosts();
    }
  }, [user, showToast, setPosts]);
  console.log(posts,"post is here")
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <div>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </div>
  );
};

export default UserPage;
