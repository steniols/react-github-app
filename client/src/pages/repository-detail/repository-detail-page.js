import React from "react";
import { Redirect } from "react-router";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import RepositoryDetailPageScreen from "./repository-detail-page.jsx";

class RepositoryDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repository: null,
      redirectTo: null,
      tags: null,
    };
  }

  componentDidMount() {
    githubService
      .getUser()
      .then((res) => (!res ? this.setState({ redirectTo: "/" }) : null));

    let repositoryId = this.props.match.params.id;
    this.loadRepository(repositoryId);
    this.loadTagsSelect();
  }

  async loadRepository(repositoryId) {
    try {
      let res = await githubService.getRepo(repositoryId);
      this.setState({ repository: res.data.data });
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

  async loadTagsSelect() {
    try {
      let res = await tagsService.list();
      const options = [];
      res.data.data.map((_res) => {
        return options.push({ key: _res.id, label: _res.title });
      });
      this.setState({ tags: options });
    } catch (error) {
      toast.error("Não foi possível carregar o select de tags.");
    }
  }

  handleSubmit(event, repository_id) {
    try {
      const tags = event.map((e) => e.value);
      const res = githubService.relTags(repository_id, tags);
      if (res) {
        toast.success("As tags do repositório foram atualizadas com sucesso!");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao atualizar as tags deste repositório");
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
