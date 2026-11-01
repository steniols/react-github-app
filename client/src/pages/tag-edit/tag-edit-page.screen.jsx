import React from 'react';
import PageTop from "../../components/page-top.component";
import Loader from "../../components/loader.component";

class TagEditPageScreen extends React.Component {
  render() {

    let editing = this.props.id || this.props.loading;
    let title = editing ? "Editar Tag" : "Nova Tag";
    let desc = editing
      ? "Editar informações de uma tag"
      : "Formulário para a criação de tags";

    return <>
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
              onClick={() => this.props.sendPost()}
              disabled={this.props.saving || this.props.loading}
              data-cy="tag-submit"
            >
              Salvar
            </button>
          </div>
        </PageTop>
        {/* While editing, wait for the tag so the loaded data can't overwrite what was typed */}
        {this.props.loading ? <Loader /> : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.props.sendPost();
          }}
        >
          <div className="form-group">
            <label htmlFor="title">
              Título <span>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={this.props.title}
              onChange={(e) => this.props.setValue({ title: e.target.value })}
              maxLength="40"
              data-cy="tag-input-title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Conteúdo</label>
            <textarea
              type="text"
              className="form-control"
              id="content"
              value={this.props.content}
              rows={4}
              style={{ resize: "none" }}
              maxLength="600"
              onChange={(e) => this.props.setValue({ content: e.target.value })}
              data-cy="tag-input-content"
            />
          </div>
          <div className="form-group">
            <label htmlFor="image_url">Url da imagem</label>
            <input
              type="text"
              className="form-control"
              id="image_url"
              value={this.props.image_url}
              onChange={(e) => this.props.setValue({ image_url: e.target.value })}
              data-cy="tag-input-image"
            />
          </div>
        </form>
        )}
      </div>
    </>
  }
}

export default TagEditPageScreen;