import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import {signupRoute} from "../utils/routesServerApi";
import RSA from "../utils/Keygenerator";


export default function Register() {
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

  useEffect(() => {
    if (localStorage.getItem("dic3-chat-user")){
      navigate("/");
    }
  }, [])

  // fonction pour générer la clé
  const generateKey = () => {
    const keys = RSA.generate(200);
    let public_key = keys.n;
    let public_exponent = keys.e;
    let private_key = keys.d;
    return { public_key, public_exponent, private_key };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // verifions si tout se passe correctement
    if (handleValidation()){
      // on va appeler notre api pour enregistrer
      const {username, email, password} = values;

      // générer les clés
      let keys = generateKey();


      const {datas} = await axios.post(signupRoute, {
        username,
        email,
        password,
        public_key: keys.public_key.toString(),
        private_key: keys.private_key.toString()
      });

      // on verifie la donnée renvoyé par l'api qui nous renvoie une status
      if (datas.status === false){
        toast.error(datas.msg, toastOptions);
      }
      if (datas.status === true){
        // on stoque l'information sur le user dans le storage locale
        localStorage.setItem("dic3-chat-user", JSON.stringify(datas.user))
        navigate("/");
      }

    }
  }

  // faire la validation des champs du formulaire
  const handleValidation = () => {
    const {username, email, password, confirmPassword} = values;
    let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
    // on va utiliser strongPassword.test() pour tester le mot de passe
    // todo: pour la version finale penser à implémenter le password fort
    if (password !== confirmPassword){
      toast.error("Mots de passe et mot de passe confirmé non conformes", toastOptions);
      return false;
    }
    else if (username.length <= 2){
      toast.error("Le nom d'utilisateur doit être de 3 caractères minimum!", toastOptions);
      return false;
    }
    else if (password.length < 8){
      toast.error("Le mot de passe doit être de 8 caractères minimum", toastOptions);
      return false;
    }
    else if (email === ""){
      toast.error("Veuillez saisir l'email", toastOptions);
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
          />
          <input type="email"
                 placeholder="Email"
                 name="email"
                 onChange={e => handleChange(e)}
          />
          <input type="password"
                 placeholder="Mot de passe"
                 name="password"
                 onChange={e => handleChange(e)}
          />
          <input type="password"
                 placeholder="Confirmez mot de passe"
                 name="confirmPassword"
                 onChange={e => handleChange(e)}
          />
          <button type="submit">Créer un utilisateur</button>
          <span>Vous avez déjà un compte?  <Link to="/login">Se connecter</Link></span>
          
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

