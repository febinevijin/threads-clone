import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
// import useFollowUnfollow from "../hooks/userFollowUnfollow";
import { Link } from "react-router-dom";

const SuggestedUser = ({ user }) => {
  //   const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
      {/* left side */}
      <Flex gap={2} as={Link} to={`${user._id}`}>
        <Avatar src={user.profilePic} />
        <Box>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {user.userName}
          </Text>
          <Text color={"gray.light"} fontSize={"sm"}>
            {user.name}
          </Text>
        </Box>
      </Flex>
      {/* right side */}
      <Button
        size={"sm"}
        // color={following ? "black" : "white"}
        color={"white"}
        // bg={following ? "white" : "blue.400"}

        bg={"blue.400"}
        // onClick={handleFollowUnfollow}
        // isLoading={updating}
        // _hover={{
        //   color: following ? "black" : "white",
        //   opacity: ".8",
        // }}
        as={Link}
        to={`${user._id}`}
      >
        view
        {/* {following ? "Unfollow" : "Follow"} */}
      </Button>
    </Flex>
  );
};

export default SuggestedUser;
