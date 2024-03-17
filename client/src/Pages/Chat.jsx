import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Contact from "../Components/Contact";
import Welcome from "../Components/Welcome";
import ChatContainer from "../Components/ChatContainer";

export default function Chat() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);


  useEffect(() => {
    if (!localStorage.getItem("user-infos1")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("user-infos1")));
    }
  }, []);

  useEffect(() => {
    const user=JSON.parse(localStorage.getItem("user-infos1"));
    const id =user.userid;
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = fetch(`http://localhost:8000/allusers/${id}`, {
          method: "GET",
        })
        setContacts(data.data)
        
      } else {
        // navigate('/avatarSet')
      }
    }
  }, [currentUser]);

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user-infos1"));
    const id=user.userid;
    
    fetch(`http://localhost:8000/allusers/${id}`)
    .then((response)=>response.json())
    .then((data)=>{
      setContacts(data)
    })
    .catch((err)=>{
      console.log(err)
    })

  },[currentUser])

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };


  return (
    <Container>
      <div className="chat-container">

        <Contact contacts={contacts} 
        currentUser={currentUser} 
        changeChat={handleChatChange} 
        />
        {
          currentChat===undefined?
          <Welcome currentUser={currentUser}/>:
          <ChatContainer currentChat={currentChat} />

        }
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .chat-container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
