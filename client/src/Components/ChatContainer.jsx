/* eslint-disable react/prop-types */
import styled from "styled-components"
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import { useEffect, useRef, useState } from "react";
import {v4 as uuidv4} from 'uuid'

export default function ChatContainer({currentChat,currentUser,socket}) {

  const [messages,setMessages]=useState([]);
  const [arrivalMessage,setArrivalMessage]=useState(null);
  const scrollRef=useRef();

  useEffect(()=>{
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

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem("user-infos1")
        ).userid;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = (msg)=>{
        socket.current.emit("send-msg", {
          to:currentChat._id,
          from:currentUser.userid,
        });

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
        .then(()=>{
          // console.log(data)
          const msgs=[...messages];
          msgs.push({fromSelf:true,message:msg})
          setMessages(msgs);
        })
        .catch((err)=>{
          console.log(err)
        });
        

        
    }
    useEffect(()=>{
      if(socket.current)
      {
        socket.current.on("msg-receive",(msg)=>{
          setArrivalMessage({fromSelf:true,message:msg})
        })
      }
    },[])
    
    useEffect(()=>{
      arrivalMessage && setArrivalMessage((prev)=> [...prev,arrivalMessage]);
    },[arrivalMessage]);

    useEffect(()=>{
      if (scrollRef.current)
      {
        scrollRef.current.scrollIntoView({behavior:"smooth"});
      }
    },[messages]);

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
            messages.map((message)=>{
              return (
                <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "received"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
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
