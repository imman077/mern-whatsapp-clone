import React from "react";
import { Button } from "@mui/material";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import "./Login.css";
import { useStateValue } from "../ContentApi/StateProvider";
import { actionTypes } from "../ContentApi/reducer";

const Login = () => {
  const [state, dispatch] = useStateValue();
  console.log(state);

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((err) => {
        alert(err.message);
      });
    0;
  };

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
          alt="logo"
        />
        <div className="login__text">
          <h1>Sign in to Whatsapp</h1>
          <Button className="button" onClick={signIn}>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
