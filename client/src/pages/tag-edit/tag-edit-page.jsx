import React from "react";
import { Redirect } from "react-router";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import toastErrors from "../../utils/toast-errors";
import TagEditPageScreen from "./tag-edit-page.screen.jsx";

class TagEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      title: "",
      content: "",
      image_url: "",
      redirectTo: null,
      saving: false,
      loading: Boolean(props.match?.params?.id),
    };
    this.sendPost = this.sendPost.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  async componentDidMount() {
    if (!(await githubService.getUser())) {
      this.setState({ redirectTo: "/" });
      return;
    }
    if (this.props?.match?.params?.id) {
      this.loadPost(this.props.match.params.id);
    }
  }

  setValue(obj) {
    this.setState(obj);
  }

  async loadPost(tagId) {
    try {
      let response = await tagsService.getOne(tagId);
      const { id, title, content, image_url } = response.data.data;
      // Apply only once: a late duplicate response (e.g. StrictMode mounts twice) must not overwrite edits
      this.setState((state) =>
        state.loading
          ? { id, title, content: content || "", image_url: image_url || "", loading: false }
          : null
      );
    } catch (error) {
      toastErrors(error, this.props.t, "Não foi possível carregar tag, tente novamente mais tarde");
      this.props.history.replace("/tag-list");
    }
  }

  async sendPost() {
    if (this.state.saving) return;
    const data = {
      title: this.state.title,
      content: this.state.content,
      image_url: this.state.image_url,
    };
    this.setState({ saving: true });
    try {
      const response = this.state.id
        ? await tagsService.edit(data, this.state.id)
        : await tagsService.create(data);
      toast.success(this.props.t(response.data.message));
      this.props.history.replace(`/tag-detail/${this.state.id || response.data.id}`);
    } catch (error) {
      toastErrors(error, this.props.t);
      this.setState({ saving: false });
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
