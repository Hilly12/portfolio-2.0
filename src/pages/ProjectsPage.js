import React, {Component, Fragment} from "react";
import Footer from "../components/Footer";
import BaseRouter from "../routes.js";

class ProjectsPage extends Component {
  render() {
    return (
      <Fragment>
        <div className="container" style={{ minHeight: "100vh" }}>
          <div style={{ marginTop: "20px" }}/>
          <BaseRouter/>
        </div>
        <Footer/>
      </Fragment>
    );
  }
}

export default ProjectsPage;
