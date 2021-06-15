import React, {Component, Fragment} from 'react';

class Placeholder extends Component {
  constructor(props) {
    super(props);
    this.toggleVisible = this.toggleVisible.bind(this);
    this.state = {
      visible: false
    }
  }

  toggleVisible() {
    this.setState({ visible: true });
  }

  componentDidMount() {
    const delay = this.props.delay ? this.props.delay : 200;
    this.tm = setTimeout(this.toggleVisible, delay);
  }

  componentWillUnmount() {
    clearTimeout(this.tm)
  }

  render() {
    const classes = this.props.classes ? this.props.classes : "placeholder";
    const margin = this.props.margin ? this.props.margin : '23% auto auto';

    return (
      <div className={classes} style={{ position: 'relative' }}>
        <div className="spinner" style={{ margin: `${margin}` }}>
          {this.state.visible &&
          <Fragment>
            <div className="rect1"/>
            <div className="rect2"/>
            <div className="rect3"/>
            <div className="rect4"/>
            <div className="rect5"/>
          </Fragment>
          }
        </div>
      </div>
    );
  }
}

export default Placeholder;