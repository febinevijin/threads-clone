import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"


const UserPage = () => {
  return (
    <div>
      <UserHeader />
      <UserPost likes={1200} replies={ 300} postImg="/post1.png" postTitle="lets talk about threads" />
      <UserPost likes={200} replies={ 300} postImg="/post2.png" postTitle="lets talk about threads" />
      <UserPost likes={800} replies={ 300} postImg="/post3.png" postTitle="lets talk about threads" />
      <UserPost likes={240} replies={ 300} postImg="/post1.png" postTitle="lets talk about threads" />
     
    </div>
  )
}

export default UserPage
