import React from 'react';
import { Link } from "react-router-dom";
import PageTop from "../../components/page-top.component";

const steps = [
  {
    icon: "fa-github",
    title: "Entre com o GitHub",
    text: "Faça login com a sua conta. Seus repositórios são importados automaticamente, inclusive os privados.",
  },
  {
    icon: "fa-tags",
    title: "Crie suas tags",
    text: "Tags são etiquetas suas, com título, descrição e imagem. Use para marcar o que quiser: linguagem, status, assunto…",
    to: "/tag-add",
    action: "Criar uma tag",
  },
  {
    icon: "fa-link",
    title: "Relacione aos repositórios",
    text: "Abra um repositório e escolha as tags dele. Um repositório pode ter várias tags, e a mesma tag pode estar em vários repositórios.",
    to: "/repository-list",
    action: "Ver repositórios",
  },
  {
    icon: "fa-search",
    title: "Encontre rapidamente",
    text: "Na lista de repositórios, busque por nome, descrição ou pelo nome de uma tag para ver tudo o que foi marcado com ela.",
    to: "/repository-list",
    action: "Buscar",
  },
];

class HomePageScreen extends React.Component {
  render() {
    const { login, showElements } = this.props;
    return <>
      <div className="container">
        <PageTop title="Bem vindo" desc="Organize seus repositórios do GitHub com tags"></PageTop>
        {login ? (
          <p>
            Você está conectado como: <b>{login}</b>
          </p>
        ) : (
          <p className={!showElements ? "d-none" : ""}>
            Faça login com sua conta do GitHub no canto superior direito para começar.
          </p>
        )}

        <h4 className="home-section-title">Como funciona</h4>
        <div className="row" data-cy="home-steps">
          {steps.map((step, index) => (
            <div className="col-12 col-md-6 col-lg-3 mb-3" key={step.title}>
              <div className="home-step">
                <div className="home-step__icon">
                  <i className={`fa ${step.icon}`}></i>
                  <span className="home-step__number">{index + 1}</span>
                </div>
                <h5>{step.title}</h5>
                <p>{step.text}</p>
                {login && step.to ? (
                  <Link to={step.to} className="home-step__action">
                    {step.action} <i className="fa fa-angle-right"></i>
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="home-example">
          <i className="fa fa-lightbulb-o"></i>
          <p>
            <b>Exemplo:</b> crie a tag <span className="badge badge-primary">React</span> e
            relacione aos repositórios que usam React. Depois, buscando por
            “react” na lista de repositórios, todos eles aparecem juntos, mesmo
            que o nome ou a descrição não mencionem React.
          </p>
        </div>
      </div>
    </>
  }
}

export default HomePageScreen;
