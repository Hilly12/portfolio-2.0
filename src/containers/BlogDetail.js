import React, {Component} from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import Placeholder from "../components/Placeholder";
import Image from "../components/Image";
import Avatar from "@material-ui/core/Avatar";
import parse from "../util/DateParse";
import { CodeBlock } from '@atlaskit/code';
import Code from "../components/Code";
import {Table} from "reactstrap";
import CopyButton from "../components/CopyButton"

const ttl = 600000; // ms - 10 min
const avatarSrc = "https://lh3.googleusercontent.com/pw/ACtC-3eRLY0BM1VpQyxfavShxfukNKuTgwBCNc4vhrn6kQjxNMY58bzBfc_tjFbUmg6Y66xApp-P5Wxwxi2hArJLqiZwQIxLywTJdmBNrmUc8-7fxB2C8SgHT-aX6TVQ6VxhGrEU3R5dBNGx4lOGjmUpVrOR=s60";

const img = (imgSrc, key) => {
  return (
    <div key={key} className="project-image-holder">
      <Image src={imgSrc} classes="project-image" placeholder={<Placeholder/>}/>
    </div>
  )
}

const code = (text, language, lined, key) => {
  return (
    <div className="code-outer" key={key}>
      <CodeBlock language={language} text={text} showLineNumbers={lined}/>
      <CopyButton text={text}/>
    </div>
  )
}

function parseData(projectData) {
  const { content } = projectData;

  let domParser = new DOMParser();
  const tree = domParser.parseFromString(content, "text/xml");

  const titleTags = tree.getElementsByTagName("header");
  if (!titleTags[0]) {
    return { title: "", content: "" };
  }
  // console.log(visit(titleTags[0]));

  const bodyTags = tree.getElementsByTagName("body");
  if (!bodyTags[0]) {
    return { title: "", content: "", toc: [] };
  }

  const toc = [];
  
  Array.from(tree.getElementsByTagName("sub")).forEach(subTag => {
    const children = [];
    subTag.childNodes.forEach((child, key) => {
      children.push(visit(child, { key: key }));
    })
    toc.push(children.toString())
  });

  return { title: visit(titleTags[0]), content: visit(bodyTags[0], toc) };
}

function visit(node, toc = null, props = null) {
  const children = [];
  node.childNodes.forEach((child, key) => {
    children.push(visit(child, toc, { key: key }));
  })

  const strictChildren = []
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      strictChildren.push(visit(node.children[i], toc, { key: i }));
    }
  }
  // console.log("visiting " + node.tagName);
  const key = props ? props.key : null;
  switch (node.tagName) {
    case 'header':
      return children.length > 0 ? children[0] : null;
    case 'body':
      return React.createElement(React.Fragment, props, children);
    case 'img':
      return img(node.getAttribute('src'), key);
    case 'a':
      return <a key={key} href={node.getAttribute('href')}>{children}</a>;
    case 'm':
      return <Code key={key}>{children}</Code>;
    case 'am':
      return <Code key={key}><a href={node.getAttribute('href')}>{children}</a></Code>;
    case 'code':
      const lang = node.getAttribute('lang');
      const lined = node.getAttribute('lined');
      const html = (node.children.length > 0 && node.children[0].tagName === "pre") ? node.children[0].innerHTML : node.innerHTML;
      let lines = html.split("\n")
      let startIndex, finishIndex;
      for (startIndex = 0; startIndex < lines.length; startIndex++)
        if (lines[startIndex].trim() !== "")
          break;
      for (finishIndex = lines.length - 1; finishIndex >= 0; finishIndex--)
        if (lines[finishIndex].trim() !== "")
          break;

      lines = lines.slice(startIndex, finishIndex + 1);
      const leadingSpaces = lines[0].length - lines[0].replace(/^\s+/gm, '').length;
      const txt = lines.map(l => l.slice(leadingSpaces)).join("\n");
      return code(txt, lang ? lang : "java", lined ? lined === "true" : true, key);
    case 'sub':
      const s = children.toString()
      return <h2 key={key} id={s.toLowerCase().replace(/\s/g, "-")} className="blog-sub">{s}</h2>
    case 'li':
      return <li key={key}>{children}</li>
    case 'tbl':
      return <Table key={key} className="blog-table" size="sm" borderless>{strictChildren}</Table>
    case 'tbody':
      return <tbody key={key}>{strictChildren}</tbody>
    case 'tr':
      return <tr key={key}>{strictChildren}</tr>
    case 'td':
      return <td key={key}>{children}</td>
    case 'toc':
      return (
        <div className="row toc-wrapper">
          <div className="col-md-3">
            <span>Table of Contents</span>
            <br/>
            {toc && generateTOC(toc)}
          </div>
          <div className="col-md-9 blog-content">
            {children}
          </div>
        </div>
      )
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

function generateTOC(toc) {
  return (
    <ul className="toc">
      {toc.map((item, key) => {
        return <li key={key}><a href={`#${item.toLowerCase().replace(/\s/g, "-")}`}>{item}</a></li>
      })}
    </ul>
  )
} 

class BlogDetail extends Component {
  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this);
    this.toggleLoaded = this.toggleLoaded.bind(this);
    this.state = {
      avatarLoading: true,
      loading: true,
      article: {},
    };
  }

  toggleLoaded() {
    this.setState({
      avatarLoading: false
    })
  }

  componentDidMount() {
    window.scroll(0, 0);

    let { blogid } = this.props.match.params;
    blogid = blogid.toString();
    
    let articlePayload = JSON.parse(localStorage.getItem('articles'));
    if (articlePayload && articlePayload.expiry > Date.now()) {
      let articles = articlePayload.data.filter(a => a.title.replace(/\s/g, "-").toLowerCase() === blogid.toLowerCase());
      if (articles.length === 0)
        articles = articlePayload.data.filter(a => a.id.toString() === blogid);
      if (articles.length > 0) {
        const { content, title } = parseData(articles[0])
        this.setState({
          loading: false,
          article: articles[0],
          title: title,
          content: content
        });
      }
    } else {
      setTimeout(this.fetch, 300);
    }
  }

  fetch() {
    const { blogid } = this.props.match.params;

    axios.get("https://www.dractal.com/stocks/blog/").then((response) => {
      let payload = {
        data: response.data,
        expiry: Date.now() + ttl
      }
      localStorage.setItem('articles', JSON.stringify(payload));
      let articles = response.data.filter(a => a.title.replace(/\s/g, "-").toLowerCase() === blogid.toLowerCase());
      if (articles.length === 0)
        articles = response.data.filter(a => a.id.toString() === blogid);
      if (articles.length > 0) {
        const { content, title } = parseData(articles[0])
        this.setState({
          loading: false,
          article: articles[0],
          title: title,
          content: content
        });
      }
    });
  }

  render() {
    const {
      title,
      date
    } = this.state.article;

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
        <div className="container-sm" style={{ textAlign: 'left', alignItems: 'center', maxWidth: '850px' }}>
          <span className="blog-header">
            {this.state.title}
          </span>
          <span className="blog-subheader">
            {title}
          </span>
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

export default BlogDetail;
