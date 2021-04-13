import React from "react";
import authService from "../../services/auth.service";
import { Link } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);

    // Iniciando o state com os valores dos campos vazios
    this.state = {
      // email: "",
      // password: "",
    };
  }

  // Função responsável por realizar o login
  // async sendLogin(event) {
  //   event.preventDefault();

  //   const data = {
  //     email: this.state.email,
  //     password: this.state.password,
  //   };

  //   if (!data.email || data.email == "") {
  //     window.alert("E-mail é obrigatório");
  //     return;
  //   }

  //   if (!data.password || data.password == "") {
  //     window.alert("Senha é obrigatória");
  //     return;
  //   }

  //   try {
  //     let res = await authService.sendLogin(data);
  //     authService.setLoggedUser(res.data.data);
  //     this.props.onLogin();
  //     this.props.history.replace("/");
  //   } catch (error) {
  //     console.log("error", error);
  //     window.alert("Não foi possível efetuar o login.");
  //   }
  // }

  render() {
    return <div className="container">Página inicial</div>;
  }
}

export default Login;
