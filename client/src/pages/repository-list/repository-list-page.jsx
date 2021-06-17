import React from 'react';
import { Link } from "react-router-dom";
import Loader from "../../components/loader.component";
import LazyLoad from "react-lazyload";
import PageTop from "../../components/page-top.component";

class RepositoryPageScreen extends React.Component {
  render() {
    return <>
      <div className="container">
        <PageTop title={"Repositórios"} desc={"Lista dos repositórios"} />

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control border-right-0"
            placeholder="Procurar repositórios..."
            onChange={(event) => this.props.search(event.target.value)}
          />
          <span className="input-group-append bg-white border-left-0 border-right-4">
            <span className="input-group-text bg-transparent">
              <i className="fa fa-search"></i>
            </span>
          </span>
        </div>

        {(this.props.loader) ? <Loader /> : ''}
  
        {this.props.repos.map((repo) => (
          <LazyLoad height={200} debounce={100} key={repo.id}>
            <Link to={"/repository-detail/" + repo.name} data-cy="list-item">
              <div className="card">
                <div className="card-body">
                  <h4>{repo.name}</h4>
                  <p className="mt-1">{repo.description}</p>
                  <p>
                    {repo.tags_desc
                      ? repo.tags_desc.split(",").map((r) => (
                        <span className="badge badge-primary" key={r}>
                          {r}
                        </span>
                      ))
                      : null}
                  </p>
                </div>
              </div>
            </Link>
          </LazyLoad>
        ))}

        {(!this.props.loader && this.props.repos.length <= 0) ?
          <p data-cy="no-found-records">Nenhum registro encontrado</p> : ''}

      </div>
    </>
  }
}

export default RepositoryPageScreen;