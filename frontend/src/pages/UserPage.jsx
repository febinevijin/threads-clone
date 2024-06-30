import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true)
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
        // if (data.isFrozen) {
        //   setUser(null);
        //   return;
        // }
        setUser(data.data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
      finally {
        setLoading(false);
      }
    };
    getUser();
  }, [id, showToast]);
  
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
      <UserPost
        likes={1200}
        replies={300}
        postImg="/post1.png"
        postTitle="lets talk about threads"
      />
      <UserPost
        likes={200}
        replies={300}
        postImg="/post2.png"
        postTitle="lets talk about threads"
      />
      <UserPost
        likes={800}
        replies={300}
        postImg="/post3.png"
        postTitle="lets talk about threads"
      />
      <UserPost
        likes={240}
        replies={300}
        postImg="/post1.png"
        postTitle="lets talk about threads"
      />
    </div>
  );
};

export default UserPage;
