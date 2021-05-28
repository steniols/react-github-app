import React from "react";
import { Redirect } from "react-router";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import PageTop from "../../components/page-top.component";

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
      let response = await tagsService.getOne(tagId);
      let tag = response.data.data;
      this.setState(tag);
    } catch (error) {
      toast.error("Não foi possível carregar tag, tente novamente mais tarde");
    }
  }

  async sendPost() {
    const { t, i18n } = this.props;
    const data = {
      title: this.state.title,
      content: this.state.content,
      image_url: this.state.image_url,
      token: localStorage.getItem("tokenGithub"),
    };
    try {
      if (this.state.id) {
        const response = await tagsService.edit(data, this.state.id);
        console.log(response.data.message);
        toast.success(t(response.data.message));
      } else {
        const response = await tagsService.create(data);
        toast.success(t(response.data.message));
      }
    } catch (error) {
      const errorMessages = error?.response?.data?.message;
      if (errorMessages) {
        const errorsTranslated = errorMessages.map((err) => t(err));
        errorsTranslated.map((e) => {
          toast.error(e);
        });
      } else {
        toast.error(
          "O servidor não está respondendo, tente novamente mais tarde"
        );
      }
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

    const { t } = this.props;

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
            <button
              className="btn btn-primary"
              onClick={() => this.sendPost()}
              data-cy="tag-submit"
            >
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
              maxLength="40"
              data-cy="tag-input-title"
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
              maxLength="600"
              onChange={(e) => this.setState({ content: e.target.value })}
              data-cy="tag-input-content"
            />
          </div>
          <div className="form-group">
            <label htmlFor="image_url">
              Url da imagem <span>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="image_url"
              value={this.state.image_url}
              onChange={(e) => this.setState({ image_url: e.target.value })}
              data-cy="tag-input-image"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default withTranslation("common")(PostEditPage);
