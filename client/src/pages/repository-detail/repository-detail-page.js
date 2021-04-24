import React from "react";
import { Redirect } from "react-router";
import PageTop from "../../components/page-top/page-top.component";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import "./repository-detail.page.css";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";

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
      console.log(error);
      alert("Não foi possível carregar o repositório.");
    }
  }

  async loadTagsSelect() {
    try {
      let res = await tagsService.list();
      const options = [];
      res.data.data.map((_res) => {
        options.push({ key: _res.id, label: _res.title });
      });
      this.setState({ tags: options });
    } catch (error) {
      console.log(error);
      alert("Não foi possível listar os tags.");
    }
  }

  handleSubmit(selected) {
    alert("Um nome foi enviado");
    // TODO: criar relação.
    console.log(selected);
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
        <div className="row">
          <div className="col-12">
            <div className="repository-info">
              <h4>ID</h4>
              <p>{this.state.repository?.id}</p>
            </div>
            <div className="repository-info">
              <h4>Título</h4>
              <a href={this.state.repository?.url}>
                <p>{this.state.repository?.name}</p>
              </a>
            </div>
            <div className="repository-info">
              <h4>Descrição</h4>
              <p>{this.state.repository?.description}</p>
            </div>
            <div className="repository-info">
              <h4>Clone URL</h4>
              <p>{this.state.repository?.clone_url}</p>
            </div>
            {this.state.tags ? (
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="">
                    <h4>Relacionar Tags</h4>
                  </label>
                  <DropdownMultiselect
                    options={this.state.tags ? this.state.tags : []}
                    handleOnChange={(selected) => {
                      this.handleSubmit(selected);
                    }}
                    name="tags"
                  />
                </div>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default RepositoryDetailPage;
