import React from "react";
import HomePageScreen from "./home-page.screen.jsx";

// Login state is handled by App, which passes `login` and `showElements`
class HomePage extends React.Component {
  render() {
    return <HomePageScreen {...this.props}></HomePageScreen>;
  }
}

export default HomePage;
