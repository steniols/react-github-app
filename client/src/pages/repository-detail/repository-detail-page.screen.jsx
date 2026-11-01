import React from 'react';
import { Link } from "react-router-dom";
import PageTop from "../../components/page-top.component";
import Loader from "../../components/loader.component";
import SelectTag from "../../components/select-tag.component";

class RepositoryDetailPageScreen extends React.Component {
  render() {
    return <>
      <div className="container" data-cy="repository-detail">
        <PageTop title={"Repositório"} desc={"Detalhes do repositório"}>
          <button
            className="btn btn-light"
            onClick={() => this.props.history.goBack()}
          >
            Voltar
          </button>
        </PageTop>

        {!this.props.repository ? (
          <Loader />
        ) : (
          <div className="row info">
            <div className="col-6 bg-light rounded-left">
              <div className="repository-info mt-4 ml-2">
                <h4>Título</h4>
                <p>{this.props.repository?.name}</p>
              </div>
              <div className="repository-info mt-4 ml-2">
                <h4>Descrição</h4>
                <p>{this.props.repository?.description}</p>
              </div>

              {this.props.tags ? (
                <form className="mt-4 ml-2">
                  <div className="form-group">
                    <label htmlFor="">
                      <h4>Relacionar Tags</h4>
                    </label>
                    {this.props.tags.length === 0 ? (
                      <p data-cy="no-tags">
                        Sem opções,{" "}
                        <Link to="/tag-add" className="text-primary font-weight-bold">
                          clique aqui para criar a primeira tag
                        </Link>.
                      </p>
                    ) : this.props.repository ? (
                      <SelectTag
                        repository_id={this.props.repository.repository_id}
                        tags={this.props.tags}
                        tagsSelected={
                          this.props.repository.tags_ids
                            ? this.props.repository.tags_ids.split(",")
                            : []
                        }
                        onChangeValue={this.props.handleSubmit}
                      ></SelectTag>
                    ) : null}
                  </div>
                </form>
              ) : null}
            </div>
            <div className="col-6 bg-light rounded-right">
              <div className="repository-info mt-4">
                <h4>Url</h4>
                <p>
                  <a
                    href={this.props.repository?.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {this.props.repository?.html_url}
                  </a>
                </p>
              </div>
              <div className="repository-info mt-4">
                <h4>Clone URL</h4>
                <p>git clone {this.props.repository?.clone_url}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  }
}

export default RepositoryDetailPageScreen;