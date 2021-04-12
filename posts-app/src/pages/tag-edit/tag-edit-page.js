import React from "react";
import { Redirect } from "react-router";
import PageTop from "../../components/page-top/page-top.component";
import authService from "../../services/auth.service";
import postsService from "../../services/posts.service";
import "./tag-edit.page.css";

class PostEditPage extends React.Component {
  constructor(props) {
    super(props);

    // State iniciado com atributos do post vazios
    this.state = {
      id: null,
      title: "",
      content: "",
      imageUrl: "",
      redirectTo: null,
    };
  }

  // Função executada assim que o componente carrega
  componentDidMount() {
    let loggedUser = authService.getLoggedUser();
    if (!loggedUser) {
      this.setState({ redirectTo: "/login" });
    }

    // Verificando se id foi passado nos parâmetros da url
    if (this.props?.match?.params?.id) {
      let postId = this.props.match.params.id;
      this.loadPost(postId);
    }
  }

  // Função que recupera os dados do post caso seja uma edição
  async loadPost(postId) {
    try {
      let res = await postsService.getOne(postId);
      let post = res.data.data[0];
      this.setState(post);
    } catch (error) {
      console.log(error);
      alert("Não foi possível carregar post.");
    }
  }

  // Função responsável por salvar o post
  async sendPost() {
    // Reunindo dados
    let data = {
      title: this.state.title,
      content: this.state.content,
      imageUrl: this.state.imageUrl,
    };

    // Realizando verificações
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
      // Caso seja uma edição, chamar o "edit" do serviço
      if (this.state.id) {
        await postsService.edit(data, this.state.id);
        alert("Post editado com sucesso!");
      }
      // Caso seja uma adição, chamar o "create" do serviço
      else {
        await postsService.create(data);
        alert("Post criado com sucesso!");
      }
      this.props.history.push("/post-list");
    } catch (error) {
      console.log(error);
      alert("Erro ao criar post.");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    let title = this.state.id ? "Editar Post" : "Novo Post";
    let desc = this.state.id
      ? "Editar informações de um post"
      : "Formulário de criação de posts";

    return (
      <div className="container">
        <PageTop title={title} desc={desc}>
          <button
            className="btn btn-light"
            onClick={() => this.props.history.replace("/post-list")}
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
            {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
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
            {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
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
            {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
          </div>
        </form>
      </div>
    );
  }
}

export default PostEditPage;
