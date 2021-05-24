import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import PageTop from "../../components/page-top/page-top.component";
import Loader from "../../components/loader.component";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import { toast } from "react-toastify";
import LazyLoad from "react-lazyload";

class PostListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      redirectTo: null,
      loader: true,
    };
  }

  componentDidMount() {
    githubService
      .getUser()
      .then((res) =>
        !res ? this.setState({ redirectTo: "/" }) : this.loadTags()
      );
  }

  async loadTags() {
    try {
      let res = await tagsService.list();
      this.setState({ tags: res.data.data, loader: false });
    } catch (error) {
      toast.error("Não foi possível listar os tags.");
    }
  }

  loader() {
    if (this.state.loader) {
      return <Loader></Loader>;
    } else {
      return this.state.tags.length <= 0 ? (
        <p data-cy="no-found-records">Nenhum registro encontrado</p>
      ) : null;
    }
  }

  callfun(obj) {
    console.log(obj);
    // var noimg =
    //   "https://bhi.com.br/wp-content/themes/arkahost52/assets/images/default-245x245.jpg";
    // obj.src = noimg;
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="container">
        <PageTop title={"Tags"} desc={"Listagem de tags"}>
          <button
            className="btn btn-primary"
            onClick={() => this.props.history.push("/tag-add")}
            data-cy="button-add-tag"
          >
            Adicionar
          </button>
        </PageTop>

        {this.loader()}

        {this.state.tags.map((tag) => (
          <LazyLoad height={200} debounce={100} key={tag.id}>
            <Link to={"/tag-detail/" + tag.id} data-cy="list-item">
              <div className="card">
                <div className="card-horizontal">
                  <div className="img-square-wrapper card-img">
                    <img
                      src={tag.image_url}
                      onError={(e) => {
                        e.target.src = "/img/image-default.png";
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">{tag.title}</h4>
                    <p className="card-text">{tag.content}</p>
                  </div>
                </div>
              </div>
            </Link>
          </LazyLoad>
        ))}
      </div>
    );
  }
}

export default PostListPage;
