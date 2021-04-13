import React from "react";
import { Redirect } from "react-router";
import PageTop from "../../components/page-top/page-top.component";
import authService from "../../services/auth.service";
import tagsService from "../../services/tags.service";
import "./tag-edit.page.css";

class PostEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      title: "",
      content: "",
      imageUrl: "",
      redirectTo: null,
    };
  }

  componentDidMount() {
    authService
      .getGithubUser()
      .then((res) => (!res ? this.setState({ redirectTo: "/" }) : null));

    if (this.props?.match?.params?.id) {
      let tagId = this.props.match.params.id;
      this.loadPost(tagId);
    }
  }

  async loadPost(tagId) {
    try {
      let res = await tagsService.getOne(tagId);
      let tag = res.data.data[0];
      this.setState(tag);
    } catch (error) {
      console.log(error);
      alert("Não foi possível carregar tag.");
    }
  }

  async sendPost() {
    let data = {
      title: this.state.title,
      content: this.state.content,
      imageUrl: this.state.imageUrl,
    };

    if (!data.title || data.title === "") {
      alert("Título é obrigatório!");
      return;
    }
    if (!data.content || data.content === "") {
      alert("Conteúdo é obrigatório!");
      return;
    }
    if (!data.imageUrl || data.imageUrl === "") {
      alert("Imagem URl é obrigatório!");
      return;
    }

    try {
      if (this.state.id) {
        await tagsService.edit(data, this.state.id);
        alert("Post editado com sucesso!");
      } else {
        await tagsService.create(data);
        alert("Post criado com sucesso!");
      }
      this.props.history.push("/tag-list");
    } catch (error) {
      console.log(error);
      alert("Erro ao criar tag.");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    let title = this.state.id ? "Editar Post" : "Novo Post";
    let desc = this.state.id
      ? "Editar informações de um tag"
      : "Formulário de criação de tags";

    return (
      <div className="container">
        <PageTop title={title} desc={desc}>
          <button
            className="btn btn-light"
            onClick={() => this.props.history.replace("/tag-list")}
          >
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={() => this.sendPost()}>
            Salvar
          </button>
        </PageTop>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={this.state.title}
              onChange={(e) => this.setState({ title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Conteúdo</label>
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
            <label htmlFor="batata">Url da imagem</label>
            <input
              type="text"
              className="form-control"
              id="batata"
              value={this.state.imageUrl}
              onChange={(e) => this.setState({ imageUrl: e.target.value })}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default PostEditPage;
