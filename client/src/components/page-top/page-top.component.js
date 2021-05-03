import React from "react";
import "./page-top.component.css";

class PageTop extends React.Component {
  render() {
    return (
      <div className="page-top mt-2">
        <div className="page-top__title">
          <h2>{this.props.title}</h2>
          <p>{this.props.desc}</p>
        </div>
        <div className="page-top__aside">{this.props.children}</div>
      </div>
    );
  }
}

export default PageTop;
