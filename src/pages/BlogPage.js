import React, {Component, Fragment} from "react";
import Footer from "../components/Footer";
import { Route } from "react-router-dom"
import BlogList from "../containers/BlogList"
import BlogDetail from "../containers/BlogDetail"

class BlogPage extends Component {
  render() {
    return (
      <Fragment>
        <div className="container" style={{ minHeight: "100vh" }}>
          <div style={{ marginTop: "20px" }}/>
          <Route exact path="/blog" component={BlogList} />
          <Route exact path="/blog/:blogid" component={BlogDetail} />
        </div>
        <Footer/>
      </Fragment>
    );
  }
}

export default BlogPage;