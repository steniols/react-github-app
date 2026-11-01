import React from "react";
import { Redirect } from "react-router";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import toastErrors from "../../utils/toast-errors";
import RepositoryDetailPageScreen from "./repository-detail-page.screen.jsx";

class RepositoryDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repository: null,
      redirectTo: null,
      tags: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (!(await githubService.getUser())) {
      this.setState({ redirectTo: "/" });
      return;
    }
    this.loadRepository(this.props.match.params.id);
    this.loadTagsSelect();
  }

  async loadRepository(repositoryId) {
    try {
      let res = await githubService.getRepo(repositoryId);
      this.setState({ repository: res.data.data });
    } catch (error) {
      toastErrors(error, this.props.t);
    }
  }

  async loadTagsSelect() {
    try {
      let res = await tagsService.list();
      const options = res.data.data.map((tag) => ({ key: tag.id, label: tag.title }));
      this.setState({ tags: options });
    } catch (error) {
      toast.error("Não foi possível carregar o select de tags.");
    }
  }

  async handleSubmit(event, repository_id) {
    try {
      const tags = event.map((e) => e.value);
      const res = await githubService.relTags(repository_id, tags);
      toast.success(this.props.t(res.message));
    } catch (error) {
      toastErrors(error, this.props.t, "Ocorreu um erro ao atualizar as tags deste repositório");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return (
      <RepositoryDetailPageScreen
        {...this.state}
        history={this.props.history}
        handleSubmit={this.handleSubmit}
      ></RepositoryDetailPageScreen>
    );
  }
}

export default withTranslation("common")(RepositoryDetailPage);
