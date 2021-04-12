import React from "react";
import { Redirect } from "react-router";
import PageTop from "../../components/page-top/page-top.component";
import authService from "../../services/auth.service";
import tagsService from "../../services/tags.service";
import "./tag-detail.page.css";

class PostDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Atributo para armazenar os dados do tag
      tag: null,
      redirectTo: null,
    };
  }

  // Função que é executada assim que o componente carrega
  componentDidMount() {
    let loggedUser = authService.getLoggedUser();
    if (!loggedUser) {
      this.setState({ redirectTo: "/login" });
    }
    // Recuperando os id do tag na url
    let tagId = this.props.match.params.id;
    // Chamando a função que carrega os dados do tag
    this.loadPost(tagId);
  }

  // Função que carrega os dados do tag e salva no state
  async loadPost(tagId) {
    try {
      let res = await tagsService.getOne(tagId);
      this.setState({ tag: res.data.data[0] });
    } catch (error) {
      console.log(error);
      alert("Não foi possível carregar tag.");
    }
  }

  // Função que exclui o tag, chamada ao clicar no botão "Excluir"
  async deletePost(tagId) {
    if (!window.confirm("Deseja realmente excluir este tag?")) return;

    try {
      await tagsService.delete(tagId);
      alert("Post excluído com sucesso");
      this.props.history.replace("/tag-list");
    } catch (error) {
      console.log(error);
      alert("Não foi excluir o tag.");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="container">
        <PageTop title={"Post"} desc={"Detalhes do tag"}>
          <button
            className="btn btn-light"
            onClick={() => this.props.history.goBack()}
          >
            Voltar
          </button>
        </PageTop>
        <div className="row">
          <div className="col-6">
            <img
              className="tag-img"
              src={this.state?.tag?.imageUrl}
              alt="image"
            />
          </div>
          <div className="col-6">
            <div className="tag-info">
              <h4>ID</h4>
              <p>{this.state.tag?.id}</p>
            </div>
            <div className="tag-info">
              <h4>Título</h4>
              <p>{this.state.tag?.title}</p>
            </div>
            <div className="tag-info">
              <h4>Conteúdo</h4>
              <p>{this.state.tag?.content}</p>
            </div>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => this.deletePost(this.state.tag.id)}
              >
                Excluir
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
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
