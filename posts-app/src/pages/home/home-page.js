import React from "react";
import { Redirect } from "react-router";
import authService from "../../services/auth.service";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
    };
  }

  componentDidMount() {
    let loggedUser = authService.getLoggedUser();
    if (!loggedUser) {
      this.setState({ redirectTo: "/login" });
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="container">
        <h1>HomePage</h1>
      </div>
    );
  }
}

export default HomePage;
