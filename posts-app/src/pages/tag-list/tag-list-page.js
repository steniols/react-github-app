import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import PageTop from "../../components/page-top/page-top.component";
import authService from "../../services/auth.service";
import postsService from "../../services/posts.service";
import "./tag-list.page.css";

class PostListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Atributo para armazenar o array de posts vindos da API.
      posts: [],
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

  // Função responsável por chamar o serviço e carregar os posts.
  async loadPosts() {
    try {
      let res = await postsService.list();
      this.setState({ posts: res.data.data });
    } catch (error) {
      console.log(error);
      alert("Não foi possível listar os posts.");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="container">
        <PageTop title={"Posts"} desc={"Listagem dos posts"}>
          <button
            className="btn btn-primary"
            onClick={() => this.props.history.push("/post-add")}
          >
            Adicionar
          </button>
        </PageTop>
        {/* Percorrendo o array de posts do state e renderizando cada um
                dentro de um link que leva para a página de detalhes do post específico */}
        {this.state.posts.map((post) => (
          <Link to={"/post-detail/" + post.id} key={post.id}>
            <div className="post-card">
              <div className="post-card__img">
                <img src={post.imageUrl} />
              </div>
              <div className="post-card__text">
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}

export default PostListPage;
