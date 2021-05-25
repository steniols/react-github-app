import React from "react";
import { Redirect } from "react-router";
import { toast } from "react-toastify";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import PageTop from "../../components/page-top.component";
import Loader from "../../components/loader.component";

class PostDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: null,
      redirectTo: null,
    };
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
      await tagsService.delete(tagId);
      toast.success("A tag foi excluída com sucesso");
      this.props.history.replace("/tag-list");
    } catch (error) {
      console.log(error);
      toast.error("Não foi possível excluir a tag.");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="container">
        <PageTop title={"Tag"} desc={"Detalhes da tag"}>
          <button
            className="btn btn-light"
            onClick={() => this.props.history.goBack()}
          >
            Voltar
          </button>
        </PageTop>

        {!this.state.tag ? <Loader /> : null}

        <div className="row  bg-light">
          <div className="col-6">
            <img
              className="img mt-3 mb-3"
              src={this.state.tag?.image_url}
              onError={(e) => {
                e.target.src = "/img/image-default.png";
              }}
            />
          </div>
          <div className="col-6">
            <div className="info mt-4">
              <h4>ID</h4>
              <p>{this.state.tag?.id}</p>
            </div>
            <div className="info">
              <h4>Título</h4>
              <p>{this.state.tag?.title}</p>
            </div>
            <div className="info">
              <h4>Conteúdo</h4>
              <p>{this.state.tag?.content}</p>
            </div>
            <div
              className="btn-group mb-3"
              role="group"
              aria-label="Basic example"
            >
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => this.deleteTag(this.state.tag.id)}
              >
                Excluir
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() =>
                  this.props.history.push("/tag-edit/" + this.state.tag.id)
                }
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PostDetailPage;
