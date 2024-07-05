import { Avatar, Flex, Text } from "@chakra-ui/react";


const Message = ({ ownMessage }) => {
  return (
    <>
      {ownMessage ?(
      <Flex gap={2} alignSelf={"flex-end"}>
        {/* <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}> */}
        <Text color={"white"}>some message here</Text>
        {/* <Box
            alignSelf={"flex-end"}
            ml={1}
            // color={message.seen ? "blue.400" : ""}
            fontWeight={"bold"}
          >
            <BsCheck2All size={16} />
          </Box> */}
        {/* </Flex> */}
        <Avatar src="" w="7" h={7} />
      </Flex>
      ):(
      <Flex gap={2}>
        <Avatar src="" w="7" h={7} />
        {/* <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}> */}
        <Text color={"white"}>some message here</Text>
        {/* <Box
            alignSelf={"flex-end"}
            ml={1}
            // color={message.seen ? "blue.400" : ""}
            fontWeight={"bold"}
          >
            <BsCheck2All size={16} />
          </Box> */}
        {/* </Flex> */}
      </Flex>
          )
          }
    </>
  );
};

export default Message;
