import React from "react";
import { Redirect } from "react-router";
import { toast } from "react-toastify";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import TagListPageScreen from "./tag-list-page.jsx";

class TagListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      redirectTo: null,
      loader: true,
    };
  }

  componentDidMount() {
    githubService
      .getUser()
      .then((res) =>
        !res ? this.setState({ redirectTo: "/" }) : this.loadTags()
      );
  }

  async loadTags() {
    try {
      let res = await tagsService.list();
      this.setState({ tags: res.data.data, loader: false });
    } catch (error) {
      toast.error("Não foi possível listar os tags.");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return <TagListPageScreen {...this.state} history={this.props.history} />;
  }
}

export default TagListPage;
