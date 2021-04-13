import React from "react";
import { Redirect } from "react-router";
import authService from "../../services/auth.service";
import queryString from "query-string";

import PageTop from "../../components/page-top/page-top.component";

class HomePage extends React.Component {
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
      authService.loginGithub(values.code).then((res) => {
        this.setState({ name: res.user.name });
        this.setState({ login: res.user.login });
        this.setState({ redirectTo: "/" });
      });
    } else {
      authService.getGithubUser().then((res) => {
        this.setState({ name: res.name });
        this.setState({ login: res.login });
      });
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="container">
        <PageTop title="Home" desc=""></PageTop>
      </div>
    );
  }
}

export default HomePage;
