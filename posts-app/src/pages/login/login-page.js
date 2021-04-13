import React from "react";
import authService from "../../services/auth.service";
import { Link, withRouter } from "react-router-dom";
import queryString from "query-string";
class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectTo: null,
      code: null,
      name: "",
      login: "",
    };
  }

  componentDidMount() {
    if (this.props?.location?.search) {
      const values = queryString.parse(this.props.location.search);
      this.setState({ code: values.code });
      authService
        .loginGithub(values.code)
        .then((res) => {
          this.props.onLogin();
          this.props.history.replace("/");
        })
        .then(() => {});
    } else {
      console.log("Erro no login!");
    }
  }

  render() {
    return <div className="container"></div>;
  }
}

export default LoginPage;
