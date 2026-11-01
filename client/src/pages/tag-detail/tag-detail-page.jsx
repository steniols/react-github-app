import React from "react";
import { Redirect } from "react-router";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import toastErrors from "../../utils/toast-errors";
import TagDetailPageScreen from "./tag-detail-page.screen.jsx";

class TagDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: null,
      redirectTo: null,
    };
    this.deleteTag = this.deleteTag.bind(this);
  }

  async componentDidMount() {
    if (!(await githubService.getUser())) {
      this.setState({ redirectTo: "/" });
      return;
    }
    this.loadTag(this.props.match.params.id);
  }

  async loadTag(tagId) {
    try {
      let res = await tagsService.getOne(tagId);
      this.setState({ tag: res.data.data });
    } catch (error) {
      toastErrors(error, this.props.t, "Não foi possível carregar a tag.");
    }
  }

  async deleteTag(tagId) {
    if (!window.confirm("Deseja realmente excluir esta tag?")) return;
    try {
      const response = await tagsService.delete(tagId);
      toast.success(this.props.t(response.data.message));
      this.props.history.replace("/tag-list");
    } catch (error) {
      toastErrors(error, this.props.t);
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return (
      <TagDetailPageScreen
        {...this.state}
        history={this.props.history}
        deleteTag={this.deleteTag}
      />
    );
  }
}

export default withTranslation("common")(TagDetailPage);
