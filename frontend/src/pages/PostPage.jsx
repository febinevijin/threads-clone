import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useState } from "react";
import Comment from "../components/Comment";

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/post1.png" size={"md"} name="Mark Zuckerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              febin
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {/* {formatDistanceToNow(new Date(currentPost.createdAt))} ago */}
            1d
          </Text>

          <BsThreeDots />

          {/* {currentUser?._id === user._id && (
            // <DeleteIcon
            //   size={20}
            //   cursor={"pointer"}
            //   onClick={handleDeletePost}
            // /> */}
          {/* )} */}
        </Flex>
      </Flex>

      <Text my={3}>ha ha</Text>

      {/* {currentPost.img && ( */}
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src="/post2.png" w={"full"} />
      </Box>
      {/* )} */}

      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          238 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {200 + (liked ? 1 : 0)}
        </Text>
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />
      {/* {currentPost.replies.map((reply) => ( */}
      <Comment
        comment="looks great!"
        createdAt="2d"
        likes={567}
        username="john doe"
        userAvatar="https://bit.ly/dan-abramov"
        // key={reply._id}
        // reply={reply}
        // lastReply={
        //   reply._id ===
        //   currentPost.replies[currentPost.replies.length - 1]._id
        // }
      />
      {/* ))} */}
    </>
  );
};

export default PostPage;
