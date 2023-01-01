import React, {useState, useEffect, useRef} from 'react';
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import axios from "axios";
import {sendMessageRoute, getMessageRoute, getPublicKey, getPrivateKey} from "../utils/routesServerApi";
import {v4 as uuidv4 } from "uuid";
import RSA from "../utils/Keygenerator"
/* global BigInt */
function ChatContainer({ currentChat, socket }) {

    const [messages, setMessages] = useState([])
    const [messageArrive, setMessageArrive] = useState(null)
    const scrollRef = useRef();

    // use state pour l'echange de clé (publikey: n, e) private key: d, n)
    const [publicKey, setPublicKey] = useState("");
    const [privateKey, setPrivateKey] = useState("")

    useEffect(() => {
        async function getKey(){
            // mettre la clé publique

            await axios.get(`${getPublicKey}/${currentChat._id}`).then((res) => {
                // set le public key
                setPublicKey(res.data.publicKey.public_key)
            })
        }

        getKey()

    }, [])

    useEffect(() => {
        async function takePrivateKey() {
            const dataUser = JSON.parse(localStorage.getItem("dic3-chat-user"));

            await axios.get(`${getPrivateKey}/${dataUser._id}`).then((res) => {
                // set le private key
                setPrivateKey(res.data.privateKey.private_key)
            })

        }

        takePrivateKey()
    }, [])

    useEffect(() => {
        async function setMsg(){
            const dataUser = await JSON.parse(localStorage.getItem("dic3-chat-user"));
            const response = await axios.post(getMessageRoute, {
                from: dataUser._id,
                to: currentChat._id
            })
            const msgs = response.data;
            setMessages(msgs)

        }
        if (currentChat){
            setMsg()
        }

    }, [currentChat])
    const handleSendMessage = async (msg) =>{
        // recupérons les données du user
        const dataUser = JSON.parse(localStorage.getItem("dic3-chat-user"));
        let messageChiffre = "";
        // gestion de la demande de clé
        // envoie de la demande

        // TODO: à modifier plus tard car pas très bon comme algo
        if (socket.current){
            socket.current.emit("key-demand", {
                to: currentChat._id,
                from: dataUser._id
            }, async function (public_key) {
                console.log((msg))
                messageChiffre = RSA.encrypt(msg, public_key);
                msg = messageChiffre
                console.log("msg chiffré " + msg)

                socket.current.emit("send-msg", {
                    to: currentChat._id,
                    from: dataUser._id,
                    msg
                })

                console.log("message chiffé" +msg)
                // appele de l'api qui permet de sauvegarder dans la base de données
                await axios.post(sendMessageRoute, {
                    from: dataUser._id,
                    to: currentChat._id,
                    message: msg
                });

                const msgs = [...messages];
                msgs.push({
                    fromSelf: true, message: msg
                });
                setMessages(msgs);
                console.log("messages " +messages)

            })
        }
        else {
            if (publicKey){
                messageChiffre = RSA.encrypt(msg, publicKey);
            }
            msg = messageChiffre
            await axios.post(sendMessageRoute, {
                from: dataUser._id,
                to: currentChat._id,
                message: msg
            });

            const msgs = [...messages];
            msgs.push({
                fromSelf: true, message: msg
            });
            setMessages(msgs);
            console.log("messages " +messages)
        }


    }

    // useEffect pour les messages reçus
    useEffect(() => {
        if (socket.current){
           socket.current.on("msg-recieve", (msg) => {
               console.log(msg)
                let private_key = privateKey
                let msgDecrypte = RSA.decrypt(msg, private_key, publicKey)
                msg = msgDecrypte;
                setMessageArrive({
                    fromSelf: false, message: msg
                })
           })
        }
    }, []);

    useEffect(() => {
        messageArrive && setMessages((prev) => [...prev, RSA.decrypt(messageArrive, privateKey)])
    }, [messageArrive]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth"})
    })



    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>
            <div className="chat-messages">
                {
                    messages.map( (message) => {

                        //console.log(RSA.decrypt(message.message, takePrivateKey(), publicKey) )
                        return (
                            <div ref={scrollRef} key={uuidv4()}>
                                <div className={`message ${message.fromSelf? "sended" : "recieved"}`}>
                                    <div className="content">
                                        <p>{RSA.decrypt(message.message, privateKey, publicKey) }</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <ChatInput handleSendMessage={ handleSendMessage }/>
        </Container>
    );
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
      .username {
        h3 {
          color: white;
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
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer;