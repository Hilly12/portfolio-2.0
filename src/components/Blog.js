import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import {Skeleton} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons/faPlay";
// import {faCommentAlt} from "@fortawesome/free-solid-svg-icons/faCommentAlt";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import parse from "../util/DateParse";
// import {faLink} from "@fortawesome/free-solid-svg-icons";

class Blog extends Component {
  render() {
    const {
      title, date, links, tags, pretext, demoSrc
    } = this.props.item;

    const text = pretext === "-" ? this.props.text : pretext;
    const url = title?.replace(/\s/g, "-").toLowerCase();

    const tech = String(tags).split(', ');
    const loading = this.props.loading;
    let linksP = undefined;
    let link = "https://drive.google.com/drive/folders/1pw6KKoYoUCNwJvs2xh250k6_NNINo5Dd?usp=sharing";
    let git = false;
    if (links) {
      linksP = JSON.parse(String(links));
      if (linksP) {
        if (linksP.git) {
          link = linksP.git;
          git = true;
        }
      }
    }

    return (
      <div
        style={{ display: "flex", textAlign: "left" }}
        className="provider-list-card needAjaxFormContainer shadowDiv"
      >
        <Skeleton loading={loading}>
          <div className="provider-list-details pos-rel">
            <div className="row">
              <div className="col-md-8">
                <Link to={`/blog/${url}`} className="cmodule" style={{ fontWeight: "bold", fontSize: "12pt" }}>
                  {title}
                </Link>
              </div>
              <div className="col-md-4 period-holder">
                <span className="period">{parse(String(date)).slice(1).join(' ')}</span>
              </div>
            </div>
            <div className="row-pretext">
              <div className="col-md-10" style={{ marginBottom: '5px', padding: '0' }}>
                {tech.map((tag, key) => {
                  return (
                    <h6 key={key} className="tech">{tag}</h6>
                  )
                })}
                <p className="details-row descPart loud">{text}</p>
              </div>
              <div className="col-md-2 project-left">
                {demoSrc !== '-' &&
                <Fragment>
                  <Link to={`${demoSrc}`}>
                    <button style={{ fontSize: '13px', padding: '2px' }}
                            className="btn btn-success">
                      <FontAwesomeIcon style={{ paddingTop: '1px', minWidth: '20px' }} icon={faPlay}/>
                    </button>
                  </Link>
                  <br className="noselect"/>
                </Fragment>
                }
                {git &&
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <button style={{ fontSize: '13px', padding: '2px' }} className="btn btn-git">
                    <FontAwesomeIcon size="lg" style={{ paddingTop: '1px', minWidth: '20px' }} icon={faGithub}/>
                  </button>
                </a>
                }
              </div>
            </div>
            {/* <div className="tags">
              {keys.map((keyword, key) => (
                <div key={key} className="tag">{keyword}</div>
              ))}
            </div> */}
          </div>
        </Skeleton>
      </div>
    );
  }
}

export default Blog;