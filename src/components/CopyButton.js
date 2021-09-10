import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";

class CopyButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text,
      focus: false,
    };
  }

  
  render() {
    return (
      <button className="btn btn-tp ripple"
        // onFocus={() => this.setState({ focus: true })}
        onClick={() => {
          navigator.clipboard.writeText(this.state.text);
          this.setState({ focus: true });
        }}
      >
        <FontAwesomeIcon icon={faClipboardList}/>
      </button>
    );
  }
}

export default CopyButton;
