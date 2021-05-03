import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import PageTop from "../../components/page-top/page-top.component";
import Loader from "../../components/loader.component";
import SelectTag from "../../components/selectTag.component";
import { toast } from "react-toastify";

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
      this.setState({ repository: res.data.userdata });
    } catch (error) {
      toast.error("Não foi possível carregar o repositório.");
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
    } catch (error) {}
  }

  handleSubmit(event, repositoryId) {
    try {
      const tags = event.map((e) => e.value);
      const res = githubService.relTags(repositoryId, tags);
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
      <div className="container">
        <PageTop title={"Repositório"} desc={"Detalhes do repositório"}>
          <button
            className="btn btn-light"
            onClick={() => this.props.history.goBack()}
          >
            Voltar
          </button>
        </PageTop>

        {!this.state.repository ? (
          <Loader />
        ) : (
          <div className="row info">
            <div className="col-6">
              <div className="repository-info mb-4">
                <h4>Título</h4>
                <p>{this.state.repository?.name}</p>
              </div>
              <div className="repository-info mb-4">
                <h4>Descrição</h4>
                <p>{this.state.repository?.description}</p>
              </div>

              {this.state.tags ? (
                <form>
                  <div className="form-group">
                    <label htmlFor="">
                      <h4>Relacionar Tags</h4>
                    </label>
                    {this.state.repository ? (
                      <SelectTag
                        repositoryId={this.state.repository.id}
                        tags={this.state.tags}
                        tagsSelected={this.state.repository.tags}
                        onChangeValue={this.handleSubmit}
                      ></SelectTag>
                    ) : null}
                  </div>
                </form>
              ) : null}
            </div>
            <div className="col-6">
              <div className="repository-info mb-4">
                <h4>Url</h4>
                <p>
                  <Link
                    to={{ pathname: this.state.repository?.html_url }}
                    target="_blank"
                  >
                    {this.state.repository?.html_url}
                  </Link>
                </p>
              </div>
              <div className="repository-info mb-4">
                <h4>Clone URL</h4>
                <p>{this.state.repository?.clone_url}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RepositoryDetailPage;
