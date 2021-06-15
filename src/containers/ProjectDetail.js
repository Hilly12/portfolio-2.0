import React, {Component} from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import Placeholder from "../components/Placeholder";
import Image from "../components/Image";
import Avatar from "@material-ui/core/Avatar";
import parse from "../util/DateParse";

const avatarSrc = "https://lh3.googleusercontent.com/pw/ACtC-3eRLY0BM1VpQyxfavShxfukNKuTgwBCNc4vhrn6kQjxNMY58bzBfc_tjFbUmg6Y66xApp-P5Wxwxi2hArJLqiZwQIxLywTJdmBNrmUc8-7fxB2C8SgHT-aX6TVQ6VxhGrEU3R5dBNGx4lOGjmUpVrOR=s60";

const img = (imgSrc, key) => {
  return (
    <div key={key} className="project-image-holder">
      <Image src={imgSrc}// {cdn.baseURL + cdn.ImgURL + cdn.ImgDir + imgSrc}
             classes="project-image"
             placeholder={<Placeholder/>}
      />
    </div>
  )
}

function parseData(projectData) {
  const { content } = projectData;

  let domParser = new DOMParser();
  const tree = domParser.parseFromString(content, "text/xml");

  const titleTags = tree.getElementsByTagName('header');
  if (!titleTags[0]) {
    return { title: "", content: "" };
  }
  console.log(visit(titleTags[0]));

  const bodyTags = tree.getElementsByTagName('body');
  if (!bodyTags[0]) {
    return { title: "", content: "" };
  }
  return { title: visit(titleTags[0]), content: visit(bodyTags[0]) };
}

function visit(node, props = null) {
  const children = [];
  node.childNodes.forEach((child, key) => {
    children.push(visit(child, { key: key }));
  })
  console.log("visiting " + node.tagName);
  switch (node.tagName) {
    case 'header':
      return children[0];
    case 'body':
      return React.createElement(React.Fragment, props, children);
    case 'img':
      const key = props ? props.key : null;
      return img(node.getAttribute('src'), key);
    case 'a':
      return <a key={props?.key} href={node.getAttribute('href')}>{children}</a>;
    case 'code':
      return React.createElement(React.Fragment, props, children);
    default:
      if (node.tagName) {
        try {
          return React.createElement(String(node.tagName), props, children);
        } catch (e) {
          console.log(e);
        }
      }
      return node.nodeValue;
  }
}

class ProjectDetail extends Component {
  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this);
    this.toggleLoaded = this.toggleLoaded.bind(this);
    this.state = {
      avatarLoading: true,
      loading: true,
      projectData: {},
    };
  }

  toggleLoaded() {
    this.setState({
      avatarLoading: false
    })
  }

  componentDidMount() {
    window.scroll(0, 0);

    setTimeout(this.fetch, 300);
  }

  fetch() {
    // http://127.0.0.1:8000/api/projects/
    // https://www.aahilm.com/api/projects/

    const { projectid } = this.props.match.params;
    axios
      .get(`https://www.aahilm.com/api/projects/${projectid}`)
      .then((response) => {
        const { content, title } = parseData(response.data)
        this.setState({
          loading: false,
          projectData: response.data,
          title: title,
          content: content
        });
        if (!this.state.projectData.article || content === "") {
          this.setState({ projectData: {} });
        }
      }).catch(e => {
      this.setState({
        loading: true
      });
    });
  }

  render() {
    const {
      title,
      date,
      // keywords
    } = this.state.projectData;

    // const keys = String(keywords).split(', ');

    if (this.state.loading || this.state.avatarLoading) {
      return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LinearProgress style={{ maxWidth: '800px', marginTop: '30vh', width: '100%' }}/>
          <img src={avatarSrc} alt="" onLoad={this.toggleLoaded} style={{display: 'none'}}/>
        </div>
      );
    }
    return (
      <div style={{ marginTop: '45px' }}>
        <div className="container-sm" style={{ textAlign: 'justify', alignItems: 'center', maxWidth: '850px' }}>
          <h2 style={{ textAlign: 'left', margin: '0' }}>
            {title}
          </h2>
          <h3 style={{ textAlign: 'left', margin: '0 0 5px 0' }}>
            {this.state.title}
          </h3>
          {this.state.content &&
          <div className="row" style={{ margin: '0 0 0 -15px' }}>
            <div className="col-md-4">
              <div style={{ display: 'flex', margin: '10px 0' }}>
                <Avatar className="my-avatar">
                  <img src={avatarSrc} alt=""/>
                </Avatar>
                <div className="text-muted" style={{ paddingLeft: '10px', position: 'relative' }}>
                  <div className="text-nowrap" style={{
                    position: 'absolute',
                    top: '50%',
                    msTransform: 'translateY(-50%)',
                    transform: 'translateY(-50%)'
                  }}>
                    Aahil Mehta
                    <br/>
                    {parse(date).join(' ')}
                  </div>
                </div>
              </div>
            </div>
            {/*<div className="col-md-8" style={{ position: 'relative' }}>*/}
            {/*  <div className="tags noselect">*/}
            {/*    {keys.map((keyword, key) => (*/}
            {/*      <span key={key} className="tag">{keyword}</span>*/}
            {/*    ))}*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
          }
          <br className="noselect"/>
          <div className="blog-content">
            {this.state.content}
          </div>
        </div>
      </div>
      // <ProgressiveImage title={this.state.projectData.title}>
      //   <p>{this.state.projectData.content}</p>
      // </ProgressiveImage>
    );
  }
}

export default ProjectDetail;
