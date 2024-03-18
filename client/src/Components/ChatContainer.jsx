/* eslint-disable react/prop-types */
import styled from "styled-components"
import Logout from "./Logout";
import ChatInput from "./ChatInput";
// import Messages from "./Messages";
import { useEffect, useState } from "react";

export default function ChatContainer({currentChat,currentUser}) {

  const [messages,setMessages]=useState([]);

  useEffect(()=>{
    alert("kklsncja")
    fetch("http://localhost:8000/getmsg",{
      method:"POST",
      headers:{
        "content-type":"application/json",
      },
      body:JSON.stringify({
        from:currentUser.userid,
        to:currentChat._id,
      }),
    })
    .then((response)=>response.json())
    .then((data)=>{
      setMessages(data);
    })
    .catch((err)=>{
      console.log(err)
    })
  },[currentChat])

  const handleSendMsg = (msg)=>{
        fetch("http://localhost:8000/addmsg",{
          method:"POST",
          body:JSON.stringify({
            from:currentUser.userid,
            to:currentChat._id,
            message:msg,
          }),
          headers:{
            "content-type": 'application/json'
          }
        })
        .then((response)=>response.json())
        .then((data)=>{
          console.log(data)
        })
        .catch((err)=>{
          console.log(err)
        })
    }

  return (
    <Container>
        <div className="chat-header">
            <div className="chat-details">
                <div className="avatar">
                    <img 
                      src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} 
                      alt="" 
                    />
                </div>
                <div className="username">
                    <h3>{currentChat.name}</h3>
                </div>
            </div>
            <Logout />
        </div>
        {/* <Messages/> */}
        <div className="chat-messages">
          {
            messages.map((message,index)=>{
              return (
                <div 
                  key={index}
                  className={`message${
                  message.fromSelf ? "sender":"received"
                }`}>
                  
                  <div className="content">
                    <p>{message.message}</p>
                  </div>

                </div>
              )
            })
          }
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  )
}

const Container = styled.div`
display: grid;
grid-template-rows: 10% 80% 10%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  grid-template-rows: 15% 70% 15%;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  .user-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 3rem;
      }
    }
  }
}
.chat-messages {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 40%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #d1d1d1;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        max-width: 70%;
      }
    }
  }
  .sended {
    justify-content: flex-end;
    .content {
      background-color: #4f04ff21;
    }
  }
  .received {
    justify-content: flex-start;
    .content {
      background-color: #9900ff20;
    }
  }
}
h3{
  color:white;
}
p{
  color:white;
}
`;
