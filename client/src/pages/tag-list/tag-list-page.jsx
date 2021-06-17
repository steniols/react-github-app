import React from 'react';
import { Link } from "react-router-dom";
import Loader from "../../components/loader.component";
import PageTop from "../../components/page-top.component";
import LazyLoad from "react-lazyload";

class TagListPageScreen extends React.Component {
  render() {
    return <>
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

        {(this.props.loader) ? <Loader /> : ''}

        {this.props.tags.map((tag) => (
          <LazyLoad height={200} debounce={100} key={tag.id}>
            <Link to={"/tag-detail/" + tag.id} data-cy="list-item">
              <div className="card">
                <div className="card-horizontal">
                  <div className="img-square-wrapper card-img">
                    <img
                      src={tag.image_url}
                      alt="Tag"
                      onError={(e) => {
                        e.target.src = "/img/image-default.png";
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">{tag.title}</h4>
                    <p className="card-text">{tag.content.substring(0, 230)}</p>
                  </div>
                </div>
              </div>
            </Link>
          </LazyLoad>
        ))}

        {(!this.props.loader && this.props.tags.length <= 0) ?
          <p data-cy="no-found-records">Nenhum registro encontrado</p> : ''}
      </div>
    </>
  }
}

export default TagListPageScreen;