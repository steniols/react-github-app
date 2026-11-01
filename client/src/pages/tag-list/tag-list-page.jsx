import React from "react";
import { Redirect } from "react-router";
import { withTranslation } from "react-i18next";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import toastErrors from "../../utils/toast-errors";
import TagListPageScreen from "./tag-list-page.screen.jsx";

class TagListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      redirectTo: null,
      loader: true,
    };
  }

  async componentDidMount() {
    if (!(await githubService.getUser())) {
      this.setState({ redirectTo: "/" });
      return;
    }
    this.loadTags();
  }

  async loadTags() {
    try {
      let res = await tagsService.list();
      this.setState({ tags: res.data.data, loader: false });
    } catch (error) {
      this.setState({ loader: false });
      toastErrors(error, this.props.t, "Não foi possível listar as tags.");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return <TagListPageScreen {...this.state} history={this.props.history} />;
  }
}

export default withTranslation("common")(TagListPage);
