import React from 'react';
import PageTop from "../../components/page-top.component";

class HomePageScreen extends React.Component {
  render() {
    return <>
      <div className="container">
        <PageTop title="Bem vindo" desc=""></PageTop>
        {this.props.login ? (
          <p>
            Você está conectado como: <b>{this.props.login}</b>
          </p>
        ) : (
          <p className={!this.props.showElements ? "d-none" : ""}>
            Faça login com sua conta do GitHub no canto superior direito.
          </p>
        )}
      </div>
    </>
  }
}

export default HomePageScreen;