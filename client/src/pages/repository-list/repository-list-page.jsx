import React from "react";
import { Redirect } from "react-router";
import { withTranslation } from "react-i18next";
import githubService from "../../services/github.service";
import toastErrors from "../../utils/toast-errors";
import RepositoryPageScreen from "./repository-list-page.screen.jsx";

const SEARCH_DELAY = 400;

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

  async componentDidMount() {
    if (!(await githubService.getUser())) {
      this.setState({ redirectTo: "/" });
      return;
    }
    this.loadRepos();
  }

  componentWillUnmount() {
    clearTimeout(this.searchTimeout);
  }

  // Debounced, so typing does not fire a request (and a GitHub sync) per keystroke
  search(searchTerm = "") {
    this.setState({ searchTerm, loader: true });
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadRepos(searchTerm), SEARCH_DELAY);
  }

  async loadRepos(search = "") {
    try {
      const repos = await githubService.getRepos(search);
      // Ignore responses for an outdated search term
      if (search === this.state.searchTerm) {
        this.setState({ repos, loader: false });
      }
    } catch (error) {
      this.setState({ repos: [], loader: false });
      toastErrors(error, this.props.t, error.message);
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
