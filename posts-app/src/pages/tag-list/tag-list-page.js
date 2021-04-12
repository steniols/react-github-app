import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import PageTop from "../../components/page-top/page-top.component";
import authService from "../../services/auth.service";
import tagsService from "../../services/tags.service";
import "./tag-list.page.css";

class PostListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Atributo para armazenar o array de tags vindos da API.
      tags: [],
      redirectTo: null,
    };
  }

  // Função que é executada assim que o componente carrega.
  componentDidMount() {
    let loggedUser = authService.getLoggedUser();
    if (!loggedUser) {
      this.setState({ redirectTo: "/login" });
    }
    this.loadPosts();
  }

  // Função responsável por chamar o serviço e carregar os tags.
  async loadPosts() {
    try {
      let res = await tagsService.list();
      this.setState({ tags: res.data.data });
    } catch (error) {
      console.log(error);
      alert("Não foi possível listar os tags.");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="container">
        <PageTop title={"Posts"} desc={"Listagem dos tags"}>
          <button
            className="btn btn-primary"
            onClick={() => this.props.history.push("/tag-add")}
          >
            Adicionar
          </button>
        </PageTop>
        {/* Percorrendo o array de tags do state e renderizando cada um
                dentro de um link que leva para a página de detalhes do tag específico */}
        {this.state.tags.map((tag) => (
          <Link to={"/tag-detail/" + tag.id} key={tag.id}>
            <div className="tag-card">
              <div className="tag-card__img">
                <img src={tag.imageUrl} />
              </div>
              <div className="tag-card__text">
                <h4>{tag.title}</h4>
                <p>{tag.content}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}

export default PostListPage;
