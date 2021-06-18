import React, {Component, Fragment} from "react";
import "../assets/Project.css";
import {List} from "antd";
import axios from "axios"
import Blog from "../components/Blog";

const ttl = 600000; // ms - 10 min
const maxWords = 60;

function extractText(data) {
  const { content } = data;

  let domParser = new DOMParser();
  const tree = domParser.parseFromString(content, "text/xml");

  const bodyTags = tree.getElementsByTagName('body');
  if (!bodyTags[0]) {
    return "";
  }

  const text = bodyTags[0].textContent;

  return text.split(" ").slice(0, maxWords).join(" ") + "...";
}

class BlogList extends Component {
  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this);
    this.state = {
      loading: true,
      articles: [{}, {}, {}, {}, {}, {}, {}, {}],
    };
  }

  componentDidMount() {
    window.scroll(0, 0);
    
    let articlePayload = JSON.parse(localStorage.getItem('articles'));
    if (articlePayload && articlePayload.expiry > Date.now()) {
      console.log(articlePayload.data)
      let articles = articlePayload.data;
      this.setState({
        loading: false,
        articles: articles.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
      });
    } else {
      setTimeout(this.fetch, 300);
    }
  }

  fetch() {
    axios.get("https://www.dractal.com/stocks/blog/").then((response) => {
      let payload = {
        data: response.data,
        expiry: Date.now() + ttl
      }
      localStorage.setItem('articles', JSON.stringify(payload));
      this.setState({
        loading: false,
        articles: response.data.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
      });
    });
  }

  render() {
    return (
      <Fragment>
        <div className="heading" style={{ marginBottom: '10px' }}>
          <h2>Blog</h2>
        </div>
        <List
          itemLayout="vertical"
          // pagination={{
          //   onChange: (page) => {
          //     console.log(page);
          //   },
          //   pageSize: 8,
          //   responsive: "true",
          // }}
          dataSource={this.state.articles}
          renderItem={(item) => (
            <Blog item={item} loading={this.state.loading} text={extractText(item)}/>
          )}
        />
      </Fragment>
    );
  }
}

export default BlogList;
