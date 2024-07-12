import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  SkeletonCircle,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import useShowToast from "../hooks/useShowToast";
import SuggestedUser from "./SuggestedUser";

const SearchUser = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false); // Track if search button clicked
  const showToast = useShowToast();

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    try {
      const res = await fetch(`api/user/search?search=${searchTerm}`);
      const data = await res.json();
      if (data.success === false && data.status === "failure") {
        showToast("Error", data.data.message, "error");
        return;
      }
      setResults(data.data);
      setSearchClicked(true); // Set search clicked after successful search
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setResults([]);
    setSearchClicked(false); // Clear search clicked state
    onClose();
  };

  return (
    <>
      <IconButton
        icon={<FiSearch size={20} />}
        onClick={onOpen}
        variant="ghost"
        aria-label="Search User"
        sx={{
          _hover: {
            background: "none", // No background change on hover
          },
          _active: {
            background: "none", // No background change on active state
          },
          _focus: {
            boxShadow: "none", // No focus outline
          },
        }}
      />

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex direction={"column"} gap={4}>
              <FormControl>
                <Input
                  placeholder="Search user"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </FormControl>
              {!loading &&
                searchClicked && // Only show after search button clicked
                results.length === 0 && <Text>No user found</Text>}
              {!loading &&
                results.map((user) => (
                  <SuggestedUser
                    key={user._id}
                    user={user}
                    onClick={handleClose}
                  />
                ))}

              {loading &&
                [0, 1, 2, 3, 4].map((_, idx) => (
                  <Flex
                    key={idx}
                    gap={2}
                    alignItems={"center"}
                    p={"1"}
                    borderRadius={"md"}
                  >
                    {/* avatar skeleton */}
                    <Box>
                      <SkeletonCircle size={"10"} />
                    </Box>
                    {/* username and fullname skeleton */}
                    <Flex w={"full"} flexDirection={"column"} gap={2}>
                      <Skeleton h={"8px"} w={"80px"} />
                      <Skeleton h={"8px"} w={"90px"} />
                    </Flex>
                    {/* follow button skeleton */}
                    <Flex>
                      <Skeleton h={"20px"} w={"60px"} />
                    </Flex>
                  </Flex>
                ))}
            </Flex>
          </ModalBody>

          <ModalFooter>
            {searchTerm && ( // Render button only if searchTerm is not empty
              <Button
                colorScheme="blue"
                size={"sm"}
                mr={3}
                onClick={handleSearch} // Use onClick to trigger search
              >
                Search
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchUser;
