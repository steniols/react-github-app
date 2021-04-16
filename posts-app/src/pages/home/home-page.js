import React from "react";
import { Redirect } from "react-router";
import githubService from "../../services/github.service";
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
      showElements: false,
    };
  }

  componentDidMount() {
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

    return (
      <div className="container">
        <PageTop title="Bem vindo" desc=""></PageTop>

        {this.state.login ? (
          <p>
            Você esta conectado como: <b>{this.state.login}</b>
          </p>
        ) : (
          <p className={!this.state.showElements ? "d-none" : ""}>
            Faça login com sua conta do github no canto superior direito para
            poder adicionar tags em seus repositórios.
          </p>
        )}
      </div>
    );
  }
}

export default HomePage;
