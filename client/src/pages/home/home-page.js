// import React from "react";
import React from "react";
import { Redirect } from "react-router";
import githubService from "../../services/github.service";
import HomePageScreen from "./home-page.jsx";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
      code: null,
      name: "",
      login: "",
      showElements: false,
    };
  }

  componentDidMount() {
    const username = new URLSearchParams(this.props.location.search).get(
      "username"
    );
    const token = new URLSearchParams(this.props.location.search).get("token");

    if (username && token) {
      this.props.history.push("/");
      localStorage.setItem("loginGithub", username);
      localStorage.setItem("tokenGithub", token);
    }

    githubService.getUser().then((res) => {
      this.setState({ name: res.name });
      this.setState({ login: res.login });
      this.setState({ showElements: true });
    });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return <HomePageScreen {...this.state}></HomePageScreen>;
  }
}

export default HomePage;
