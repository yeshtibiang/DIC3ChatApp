import React, {useState, useEffect, useRef} from 'react'
import styled from "styled-components";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {allUsersRoute, host} from "../utils/routesServerApi";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import {io} from "socket.io-client"
export default function Chat() {
    const socket = useRef();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    // recuperons le user courant
    const [currentUser, setCurrentUser] = useState(undefined)
    const [currentChat, setCurrentChat] = useState(undefined);

    useEffect( () => {
        async function effectFunction(){
            if (!localStorage.getItem("dic3-chat-user")){
                navigate("/login");
            }
            else{
                setCurrentUser(await JSON.parse(localStorage.getItem("dic3-chat-user")));

            }
        }

        effectFunction();

    }, [])

    useEffect( () => {
        if (currentUser){
            socket.current = io(host);
            socket.current.emit("add-user",currentUser._id);
        }
    }, [currentUser])

    useEffect(() => {

        async function fetchData(){
            if (currentUser){
                const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data);

            }
        }
        fetchData();

    }, [currentUser])

    // fonction pour gérer le changement de chat
    const handleChatChange = (chat) =>{
        setCurrentChat(chat)
    }
  return (
          <Container>
              <div className="container">
                  <Contacts contacts={contacts} currentuser={currentUser} changeChat={handleChatChange} />
                  {
                      currentChat === undefined ? (
                          <Welcome />
                          ): (
                          <ChatContainer currentChat={currentChat} socket={socket} />
                      )}
              </div>
          </Container>
  )
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