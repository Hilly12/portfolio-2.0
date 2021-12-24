import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import {Skeleton} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons/faCrown";
import Image from "./Image";
import Placeholder from "./Placeholder";
import {faPlay} from "@fortawesome/free-solid-svg-icons/faPlay";
import {faCommentAlt} from "@fortawesome/free-solid-svg-icons/faCommentAlt";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import parse from "../util/DateParse";
import {faLink} from "@fortawesome/free-solid-svg-icons";

class Project extends Component {
  render() {
    const {
      title, imgSrc, pretext, date, links, technologies, keywords, demoSrc, award, article
    } = this.props.item;

    const tech = String(technologies).split(', ');
    const keys = String(keywords).split(', ');
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
          <div className="provider-left-block textAlignCen">
            <div className="provider-image-block ">
              <Image src={imgSrc}
                     transition="visibility 0s, opacity 0.65s ease-in-out"
                     classes="provider-img"
                     placeholder={<Placeholder/>}/>
              {award !== '-' &&
              <span className="sponsFeaturedTag noselect">
                <FontAwesomeIcon color="#f1b82d" icon={faCrown}/> {' '} {award}
              </span>
              }
            </div>
          </div>
          <div className="provider-list-details pos-rel">
            <div className="row">
              <div className="col-md-6">
                <h5 style={{ margin: '0px 0px 5px 0px' }}>
                  {title}
                </h5>
              </div>
              <div className="col-md-6 period-holder">
                <span className="period">{parse(String(date)).slice(1).join(' ')}</span>
              </div>
            </div>
            <div className="row-pretext">
              <div className="col-md-10" style={{ marginBottom: '5px', padding: '0' }}>
                {tech.map((tech, key) => {
                  return (
                    <h5 key={key} className="tech">{tech}</h5>
                  )
                })}
                <p className="details-row descPart loud">{pretext}</p>
                {/* <div className="row text-nowrap text-muted" style={{ marginBottom: '5px' }}>
                  <div className="col-md-3">
                    <FontAwesomeIcon style={{ paddingTop: '1px', minWidth: '18px' }} icon={faClock}/> {' '}
                    {timespan}
                  </div>
                  <div className="col-md-3">
                    <FontAwesomeIcon style={{ paddingTop: '1px', minWidth: '18px' }}
                                     icon={teamSize === 1 ? faUser : faUsers}/> {' '}
                    {teamSize === 1 ? 'Individual' : (teamSize === 0 ? 'Open' : `${teamSize} people`)}
                  </div>
                </div> */}
              </div>
              <div className="col-md-2 project-left">
                {linksP &&
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {git ?
                    <button style={{ fontSize: '13px', padding: '2px' }}
                            className="btn btn-git"
                    >
                      <FontAwesomeIcon size="lg" style={{ paddingTop: '1px', minWidth: '20px' }} icon={faGithub}/>
                    </button> :
                    <button style={{ fontSize: '13px', padding: '2px' }}
                            className="btn btn-blue">
                      <FontAwesomeIcon style={{ paddingTop: '1px', minWidth: '20px' }} icon={faLink}/>
                    </button>}
                    <br className="noselect"/>
                </a>
                }
                {article &&
                <Fragment>
                  <Link to="../blog">
                    <button style={{ fontSize: '13px', padding: '2px' }}
                            className="btn btn-blue">
                      <FontAwesomeIcon style={{ paddingTop: '1px', minWidth: '20px' }} icon={faCommentAlt}/>
                    </button>
                  </Link>
                  <br className="noselect"/>
                </Fragment>
                }
                {demoSrc !== '-' &&
                <Fragment>
                  <Link to={`${demoSrc}`}>
                    <button style={{ fontSize: '13px', padding: '2px' }}
                            className="btn btn-green">
                      <FontAwesomeIcon style={{ paddingTop: '1px', minWidth: '20px' }} icon={faPlay}/>
                    </button>
                  </Link>
                  <br className="noselect"/>
                </Fragment>
                }
              </div>
            </div>
            <div className="tags">
              {keys.map((keyword, key) => (
                <div key={key} className="tag">{keyword}</div>
              ))}
            </div>
          </div>
        </Skeleton>
      </div>
    );
  }
}

export default Project;
