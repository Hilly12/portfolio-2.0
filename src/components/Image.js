import React from "react";

class Image extends React.Component {
  constructor(props) {
    super(props);

    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.delayedImageLoad = this.delayedImageLoad.bind(this);
    this.state = {
      loaded: false
    }
  }

  handleImageLoaded() {
    this.setState({ loaded: true });
  }

  delayedImageLoad() {
    setTimeout(this.handleImageLoaded, this.props.delay);
  }

  render() {
    const loaded = this.state.loaded;
    const transition = this.props.transition ? this.props.transition : 'visibility 0s, opacity 0.5s ease-out';
    const imageStyle = !loaded ? {
      visibility: 'hidden',
      position: 'absolute',
      opacity: '0',
      objectFit: 'cover',
      transition: transition
    } : { visibility: 'visible', opacity: '1', transition: transition, objectFit: 'cover' };
    return (
      <div className="imageHolder">
        {!loaded && this.props.placeholder}
        <img className={["noselect", this.props.classes].join(' ')} src={this.props.src} style={imageStyle}
             onLoad={this.delayedImageLoad} alt=""/>
      </div>
    )
  }
}

export default Image;