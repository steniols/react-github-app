import React from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/">
            Post App
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarMenu"
            aria-controls="navbarMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarMenu">
            <div className="navbar-nav">
              <a href="/" className="nav-item nav-link">
                Home
              </a>
              <a href="/" className="nav-item nav-link">
                Posts
              </a>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default App;
