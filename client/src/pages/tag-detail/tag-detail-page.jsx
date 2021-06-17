import React from 'react';
import PageTop from "../../components/page-top.component";
import Loader from "../../components/loader.component";

class TagDetailPageScreen extends React.Component {
  render() {
    return <>
      <div className="container">
        <PageTop title={"Tag"} desc={"Detalhes da tag"}>
          <button
            className="btn btn-light"
            onClick={() => this.props.history.goBack()}
          >
            Voltar
          </button>
        </PageTop>

        {!this.props.tag ? <Loader /> : null}

        <div className="row  bg-light">
          <div className="col-6">
            <img
              alt="Tag"
              className="img mt-3 mb-3"
              src={this.props.tag?.image_url}
              onError={(e) => {
                e.target.src = "/img/image-default.png";
              }}
            />
          </div>
          <div className="col-6">
            <div className="info mt-4">
              <h4>ID</h4>
              <p>{this.props.tag?.id}</p>
            </div>
            <div className="info">
              <h4>Título</h4>
              <p>{this.props.tag?.title}</p>
            </div>
            <div className="info">
              <h4>Conteúdo</h4>
              <p>{this.props.tag?.content}</p>
            </div>
            <div
              className="btn-group mb-3"
              role="group"
              aria-label="Basic example"
            >
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => this.props.deleteTag(this.props.tag.id)}
              >
                Excluir
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() =>
                  this.props.history.push("/tag-edit/" + this.props.tag.id)
                }
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  }
}

export default TagDetailPageScreen;