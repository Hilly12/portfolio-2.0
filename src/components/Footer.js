import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer
        className="page-footer"
        style={{ backgroundColor: "transparent" }}
      >
        <div
          className="footer-copyright text-center py-3"
          style={{ fontSize: "16px", backgroundColor: "transparent" }}
        >
          Aahil Mehta © 2021
        </div>
      </footer>
    );
  }
}

export default Footer;
