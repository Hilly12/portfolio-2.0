import React, {Component, Fragment} from "react";
import Footer from "../components/Footer";
import ProjectList from "../containers/ProjectList";

class ProjectsPage extends Component {

  componentDidMount() {
    document.title = "Projects"
  }

  render() {
    return (
      <Fragment>
        <div className="container" style={{ minHeight: "100vh" }}>
          <div style={{ marginTop: "20px" }}/>
          <ProjectList/>
        </div>
        <Footer/>
      </Fragment>
    );
  }
}

export default ProjectsPage;
