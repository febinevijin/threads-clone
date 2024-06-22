import { Button, Flex } from "@chakra-ui/react"
import { Link } from "react-router-dom"


const Homepage = () => {
  return (
    <Link to ={"/febin"}>
          <Flex w={"full"} justifyContent={"center"}>
             <Button mx={"auto"}>Visit profile Page</Button> 
      </Flex>
    </Link>
  )
}

export default Homepage
