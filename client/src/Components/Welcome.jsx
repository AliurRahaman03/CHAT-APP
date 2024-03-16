/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styled from "styled-components";
import robot from '../assets/robot.gif'

export default function Welcome()
{
    const [userName,setUserName]=useState();

    useEffect(()=>{
        setUserName(
            JSON.parse(localStorage.getItem("user-infos1")).name
        );
    },[])

    return(
        <Container>
            <img src={robot} alt="" />
            <h1>
                Welcome, <span>{userName}!</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
        </Container>
    )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;