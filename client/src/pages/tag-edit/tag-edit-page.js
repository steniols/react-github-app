import React from "react";
import { Redirect } from "react-router";
import PageTop from "../../components/page-top/page-top.component";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import { toast } from "react-toastify";

class PostEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      title: "",
      content: "",
      image_url: "",
      redirectTo: null,
    };
  }

  componentDidMount() {
    githubService
      .getUser()
      .then((res) => (!res ? this.setState({ redirectTo: "/" }) : null));

    if (this.props?.match?.params?.id) {
      let tagId = this.props.match.params.id;
      this.loadPost(tagId);
    }
  }

  async loadPost(tagId) {
    try {
      let res = await tagsService.getOne(tagId);
      let tag = res.data.data;
      this.setState(tag);
    } catch (error) {
      toast.error("Não foi possível carregar tag.");
    }
  }

  async sendPost() {
    let data = {
      title: this.state.title,
      content: this.state.content,
      image_url: this.state.image_url,
      token: localStorage.getItem("tokenGithub"),
    };

    if (!data.title || data.title === "") {
      toast.error("O Título é obrigatório!");
      return;
    }
    if (!data.content || data.content === "") {
      toast.error("O Conteúdo é obrigatório!");
      return;
    }
    if (!data.image_url || data.image_url === "") {
      toast.error("A Imagem URl é obrigatória!");
      return;
    }

    try {
      if (this.state.id) {
        await tagsService.edit(data, this.state.id);
        toast.success("A tag foi editada com sucesso!");
      } else {
        await tagsService.create(data);
        toast.success("A tag foi criada com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao criar a tag!");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    let title = this.state.id ? "Editar Tag" : "Nova Tag";
    let desc = this.state.id
      ? "Editar informações de uma tag"
      : "Formulário para a criação de tags";

    return (
      <div className="container">
        <PageTop title={title} desc={desc}>
          <div className="btn-group" role="group" aria-label="Basic example">
            <button
              className="btn btn-light"
              onClick={() => this.props.history.replace("/tag-list")}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={() => this.sendPost()}>
              Salvar
            </button>
          </div>
        </PageTop>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="title">
              Título <span>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={this.state.title}
              onChange={(e) => this.setState({ title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">
              Conteúdo <span>*</span>
            </label>
            <textarea
              type="text"
              className="form-control"
              id="content"
              value={this.state.content}
              rows={4}
              style={{ resize: "none" }}
              onChange={(e) => this.setState({ content: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="batata">
              Url da imagem <span>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="batata"
              value={this.state.image_url}
              onChange={(e) => this.setState({ image_url: e.target.value })}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default PostEditPage;
