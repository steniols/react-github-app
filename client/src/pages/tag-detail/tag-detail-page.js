import React from "react";
import { Redirect } from "react-router";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import TagDetailPageScreen from "./tag-detail-page.jsx";

class TagDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: null,
      redirectTo: null,
    };
    this.deleteTag = this.deleteTag.bind(this);
  }

  componentDidMount() {
    githubService
      .getUser()
      .then((res) => (!res ? this.setState({ redirectTo: "/" }) : null));

    let tagId = this.props.match.params.id;
    this.loadTag(tagId);
  }

  async loadTag(tagId) {
    try {
      let res = await tagsService.getOne(tagId);
      this.setState({ tag: res.data.data });
    } catch (error) {
      console.log(error);
      toast.error("Não foi possível carregar a tag.");
    }
  }

  async deleteTag(tagId) {
    if (!window.confirm("Deseja realmente excluir esta tag?")) return;
    try {
      const response = await tagsService.delete(tagId);
      toast.success(this.props.t(response.data.message));
      this.props.history.replace("/tag-list");
    } catch (error) {
      const errorMessages = error?.response?.data?.message;
      if (errorMessages) {
        const errorsTranslated = errorMessages.map((err) => this.props.t(err));
        errorsTranslated.map((e) => toast.error(e));
      } else {
        toast.error(
          "O servidor não está respondendo, tente novamente mais tarde"
        );
      }
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
