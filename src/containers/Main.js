import React from "react";
import {Switch, Route} from "react-router-dom";
import Snake from "../games/snake/Snake";
import LandingPage from "../pages/LandingPage";
import ProjectsPage from "../pages/ProjectsPage";
import ResumePage from "../pages/ResumePage";
import ArcadePage from "../pages/ArcadePage";
import pcg from "../games/pcg/CaveGenerator";
import Spaceshooter from "../games/spaceshooter/Spaceshooter";
import Chess from "../games/chess/Chess";
import Stocks from "../games/stocks/Stocks";

class Main extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={LandingPage}/>
        <Route path="/projects" component={ProjectsPage}/>
        <Route path="/blog" component={ProjectsPage}/>c
        <Route exact path="/resume" component={ResumePage}/>
        <Route exact path="/sandbox" component={ArcadePage}/>
        <Route exact path="/sandbox/snake" component={Snake}/>
        <Route exact path="/sandbox/cavegen" component={pcg}/>
        <Route exact path="/sandbox/spaceshooter" component={Spaceshooter}/>
        <Route exact path="/sandbox/chess" component={Chess}/>
        <Route exact path="/sandbox/stocks" component={Stocks}/>
      </Switch>
    );
  }
}

export default Main;
