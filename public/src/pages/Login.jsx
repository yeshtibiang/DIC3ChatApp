import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import {loginRoute} from "../utils/routesServerApi";


export default function Login() {
  const navigate = useNavigate();
  // les options pour designer le toast
  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // création du state
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  // utilisons useEffect pour rediriger l'utilisateur s'il est connecté
  // cad s'il existe une entré dans le local storage
  useEffect(() => {

    if (localStorage.getItem("dic3-chat-user")){
      navigate("/");
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    // verifions si tout se passe correctement
    if (handleValidation()){
      // on va appeler notre api pour enregistrer
      const {username, email, password} = values;
      const {data} = await axios.post(loginRoute, {
        username,
        password
      });

      // on verifie la donnée renvoyé par l'api qui nous renvoie une status
      if (data.status === false){
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true){
        // on stoque l'information sur le user dans le storage locale
        localStorage.setItem("dic3-chat-user", JSON.stringify(data.user));
        navigate("/");
      }

    }
  }

  // faire la validation des champs du formulaire
  const handleValidation = () => {
    const {username, password} = values;
    let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
    // on va utiliser strongPassword.test() pour tester le mot de passe
    // todo: pour la version finale penser à implémenter le password fort
    if (username === ""){
      toast.error("Veuillez entrer le nom d'utilisateur", toastOptions);
      return false;
    }
    else if (password ===""){
      toast.error("Veuillez entrer le mot de passe", toastOptions);
      return false;
    }

    return true;
  }

  function handleChange(e) {
    setValues({...values, [e.target.name]: e.target.value});
  }

  return (
      <>
        <FormContainer>
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className="brand">
              <img src="" alt=""/>
              <h1>Dic3 chat</h1>
            </div>
            <input type="text"
                   placeholder="Nom d'utilisateur"
                   name="username"
                   onChange={e => handleChange(e)}
                   min="3"
            />
            <input type="password"
                   placeholder="Mot de passe"
                   name="password"
                   onChange={e => handleChange(e)}
            />
            <button type="submit">Se connecter</button>
            <span>Pas de compte?  <Link to="/signup">Inscrivez vous</Link></span>

          </form>
        </FormContainer>
        <ToastContainer />
      </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #2a2a5e;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 5rem;
    }

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #af98ee;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;

    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #4e0eff;
    }
  }

  span {
    color: white;
    text-transform: uppercase;

    a {
      color: #774af3;
      text-decoration: none;
      font-weight: bold;
    }
    a:hover{
      text-decoration: underline;
    }
  }
`;

