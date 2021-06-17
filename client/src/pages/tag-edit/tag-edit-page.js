import React from "react";
import { Redirect } from "react-router";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import TagEditPageScreen from "./tag-edit-page.jsx";

class TagEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      title: "",
      content: "",
      image_url: "",
      redirectTo: null,
    };
    this.sendPost = this.sendPost.bind(this);
    this.setValue = this.setValue.bind(this);
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

  setValue(obj) {
    this.setState(obj);
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
        toast.success(this.props.t(response.data.message));
      } else {
        const response = await tagsService.create(data);
        toast.success(this.props.t(response.data.message));
      }
    } catch (error) {
      const errorMessages = error?.response?.data?.message;
      if (errorMessages) {
        const errorsTranslated = errorMessages.map((err) => this.props.t(err));
        errorsTranslated.map((e) => toast.error(e));
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
    return (
      <TagEditPageScreen
        {...this.state}
        history={this.props.history}
        sendPost={this.sendPost}
        setValue={this.setValue}
      />
    );
  }
}

export default withTranslation("common")(TagEditPage);
