import React, {Component} from 'react';

class Modal extends Component {
  render() {
    const maxHeight = this.props.height ? this.props.height : '400px';

    return (
      <div className="popup">
        <div style={{ maxWidth: "500px"}} className="popup_inner">
          <div className="popup-header">
            <h3 className="text-info">{this.props.title}</h3>
            <button className="btn btn-danger btn-popup-close" onClick={this.props.toggle}>X</button>
          </div>
          <div style={{ paddingTop: '10px', maxHeight: `${maxHeight}`, textAlign: 'center', overflowY: "auto" }}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;