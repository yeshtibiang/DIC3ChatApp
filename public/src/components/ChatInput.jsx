import React, {useState} from 'react';
import styled from "styled-components"
import { IoMdSend} from "react-icons/io";

function ChatInput({ handleSendMessage }) {
    const [msg, setMsg] = useState("");

    const sendChat = (e) => {
        e.preventDefault();
        if (msg.length > 0){
            handleSendMessage(msg);
            setMsg("");
        }
    }

    return (
        <Container>
            <div className="button-container">
                <form onSubmit={(e) => sendChat(e)} className="input-container">
                    <input
                        type="text"
                        placeholder="Taper un message"
                        onChange={(e) => setMsg(e.target.value)}
                        value={msg}
                    />
                    <button type="submit">
                        <IoMdSend />
                    </button>
                </form>
            </div>
        </Container>
    );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
export default ChatInput;