import React from "react";
import { Redirect } from "react-router";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import githubService from "../../services/github.service";
import RepositoryPageScreen from "./repository-list-page.jsx";

class RepositoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
      repos: [],
      loader: true,
      searchTerm: "",
    };
    this.search = this.search.bind(this);
  }

  search(searchTerm = "") {
    this.setState({ searchTerm: searchTerm, loader: true });
  }

  componentDidMount() {
    githubService
      .getUser()
      .then((res) =>
        !res ? this.setState({ redirectTo: "/" }) : this.loadRepos()
      );
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.searchTerm !== prevState.searchTerm) {
      let filteredRepos = [];
      this.setState({ repos: [], loader: true });
      try {
        filteredRepos = await githubService.getRepos(this.state.searchTerm);
      } catch (error) {
        console.log(error);
      }
      this.setState({ repos: filteredRepos, loader: false });
    }
  }

  async loadRepos(search = false) {
    try {
      let res = await githubService.getRepos(search);
      this.setState({ repos: res, loader: false });
    } catch (error) {
      const errorMessages = error?.response?.data?.message;
      if (errorMessages) {
        const errorsTranslated = errorMessages.map((err) => this.props.t(err));
        errorsTranslated.map((e) => toast.error(e));
      } else {
        toast.error(
          "O servidor não está respondendo, tente novamente mais tarde."
        );
      }
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return <RepositoryPageScreen {...this.state} search={this.search} />;
  }
}

export default withTranslation("common")(RepositoryPage);
