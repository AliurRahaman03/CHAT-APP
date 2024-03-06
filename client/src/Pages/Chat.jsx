import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Contact from "../Components/Contact";

export default function Chat() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    if (!localStorage.getItem("user-infos1")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("user-infos1")));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        fetch(`http://localhost:8000/allusers/${currentUser.userid}`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            setContacts(data);
            console.log("get data" + data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // navigate('/avatarSet')
      }
    }
  }, [currentUser]);

  return (
    <Container>
      <div className="container">
        <Contact contacts={contacts} currentUser={currentUser} />
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
  .container {
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
