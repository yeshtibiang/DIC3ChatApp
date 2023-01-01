import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome(){

    const [userName, setUserName] = useState("");
    useEffect(() => {

        async function setNomUser(){
            setUserName(
                await (JSON).parse(
                    localStorage.getItem("dic3-chat-user")
                ).username
            );
        }
        setNomUser()
    }, []);

    return (
        <Container>
            <img src={Robot} alt="Robot gif"/>
            <h1>
                Bienvenue, <span>{userName}!</span>
            </h1>
            <h3>Selectionnez un utilisateur pour commencer à discuter</h3>
        </Container>
        );

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