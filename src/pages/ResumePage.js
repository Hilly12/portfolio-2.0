import React, {Component, Fragment} from "react";
import Footer from "../components/Footer";
import "../assets/Resume.css";
import {Table} from "reactstrap";
import CustomTooltip from "../components/CustomTooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock as pendingIcon} from "@fortawesome/free-solid-svg-icons/faClock";
import {faCheckCircle as completedIcon} from "@fortawesome/free-solid-svg-icons/faCheckCircle"
import {faLinkedinIn} from "@fortawesome/free-brands-svg-icons/faLinkedinIn";
import Avatar from "@material-ui/core/Avatar";
import {faFacebookF} from "@fortawesome/free-brands-svg-icons/faFacebookF";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import {faFileAlt} from "@fortawesome/free-solid-svg-icons/faFileAlt";
import Placeholder from "../components/Placeholder";
import MyData from "../res/MyData";

const {
  workexp, languages, frameworks,
  education, awards, modules, links
} = MyData

class ResumePage extends Component {
  constructor(props) {
    super(props);

    this.OnLoaded = this.OnLoaded.bind(this);
    // this.toggleLang = this.toggleLang.bind(this);
    // this.toggleTech = this.toggleTech.bind(this);

    this.state = {
      loading: true,
      // langModal: false,
      // techModal: false
    }
  }

  componentDidMount() {
    window.scroll(0, 0);
  }

  OnLoaded() {
    this.setState({ loading: false })
  }

  // toggleLang() {
  //   this.setState({
  //     langModal: !this.state.langModal
  //   })
  // }

  // toggleTech() {
  //   this.setState({
  //     techModal: !this.state.techModal
  //   })
  // }

  render() {
    return (
      <Fragment>
        <section className="portfolio-block.cv">
          {this.state.loading && <Placeholder classes="landing-placeholder" margin="15% auto auto"/>}
          <div className="container" style={{
            visibility: `${this.state.loading ? 'hidden' : 'visible'}`,
            opacity: `${this.state.loading ? '0' : '1'}`,
            transition: 'visibility 0s, opacity 0.65s ease-in-out'
          }}>
            {/* Bio */}
            <div className="bio group" style={{ marginTop: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img className="brand-img noselect"
                     src="https://lh3.googleusercontent.com/pw/ACtC-3dnSyKxnAC4Ri17CWuHA0GlDan8LI7bi5CMA4Q2HcDhpIMVdBoOMeZkDmcATXT3G_wIlGO5P8nSq1YjV4D98GxJca-g1YGjD1IF8WAWRxCJtI6bFTkPcYc8w4ngSD0w47x8k7-vl8zkmhRae159xQYYVg=s800-no?authuser=0"
                     alt="" onLoad={this.OnLoaded}/>
              </div>
              <br className="noselect"/>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a href="https://uk.linkedin.com/in/aahil-mehta" target="_blank" rel="noopener noreferrer">
                  <Avatar className="fa linkedin">
                    <FontAwesomeIcon icon={faLinkedinIn}/>
                  </Avatar>
                </a>
                <a href="https://www.facebook.com/people/Aahil-Mehta/100005988258237" target="_blank"
                   rel="noopener noreferrer">
                  <Avatar className="fa facebook">
                    <FontAwesomeIcon icon={faFacebookF}/>
                  </Avatar>
                </a>
                <a href="https://www.doc.ic.ac.uk/~am11218/CV.pdf" target="_blank" rel="noopener noreferrer">
                  <Avatar className="fa file">
                    <FontAwesomeIcon icon={faFileAlt}/>
                  </Avatar>
                </a>
                <a href="https://github.com/Hilly12" target="_blank" rel="noopener noreferrer">
                  <Avatar className="fa github">
                    <FontAwesomeIcon size="lg" icon={faGithub}/>
                  </Avatar>
                </a>
              </div>
            </div>

            {/* Experience */}
            <div className="work-experience group">
              <div className="heading">
                <h2 className="text-center">Experience</h2>
              </div>
              {workexp.map((work, key) => {
                return (
                  <div key={key} className="item">
                    <div className="row">
                      <div className="col-md-6">
                        <h3>{work.title}</h3>
                        <h4 className="organization no-wrap">{work.institution}</h4>
                      </div>
                      <div className="col-md-6 period-holder">
                        <span className="period">{work.period}</span>
                      </div>
                    </div>
                    <ul className="bullets">
                      <p className="text-muted">
                        {work.description.map((text, key) => {
                          return <li key={key}>{text}</li>;
                        })}
                      </p>
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Skills */}
            <div className="group">
              <div className="row">
                <div className="col-md-6">
                  <div className="skills portfolio-info-card">
                    <h2>
                      Languages
                      {/* <FontAwesomeIcon onClick={this.toggleLang} className="info-icon" style={{ marginLeft: '10px' }}
                                       icon={faInfoCircle}/> */}
                    </h2>
                    {languages.map((lang, key) => {
                      return (
                        <Fragment key={key}>
                          <h3>{lang.name}</h3>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              aria-valuenow={lang.proficiency}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              style={{ width: `${lang.proficiency}%` }}
                            >
                              <span className="sr-only">100%</span>
                            </div>
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="skills portfolio-info-card">
                    <h2>
                      Skills
                      {/* <FontAwesomeIcon onClick={this.toggleTech} className="info-icon" style={{ marginLeft: '10px' }}
                                       icon={faInfoCircle}/> */}
                    </h2>
                    <div style={{"display": "float"}}>
                      {frameworks.map((name, key) => {
                        return (
                          <h4 key={key} className="framework organization">{name}</h4>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="education group">
              <div className="heading">
                <h2 className="text-center">Education</h2>
              </div>
              {education.map((edu, key) => {
                return (
                  <div key={key} className="item">
                    <div className="row">
                      <div className="col-md-6">
                        <h3>{edu.title}</h3>
                        <h4 className="organization no-wrap">{edu.institution}</h4>
                      </div>
                      <div className="col-md-6 period-holder">
                        <span className="period">{edu.period}</span>
                      </div>
                    </div>
                    <ul className="bullets">
                      <p className="text-muted">
                        {edu.description.map((text, key) => {
                          return <li key={key}>{text}</li>;
                        })}
                      </p>
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Awards */}
            <div className="awards group">
              <div className="heading">
                <h2 className="text-center">Awards and Achievements</h2>
              </div>
              {awards.map((award, key) => {
                return (
                  <CustomTooltip key={key} tooltip={award.tip}>
                    {award.text}
                  </CustomTooltip>
                );
              })}
            </div>

            {/* Hobbies */}
            {/*<div className="hobbies group">*/}
            {/*  <div className="heading">*/}
            {/*    <h2 className="text-center">Hobbies</h2>*/}
            {/*  </div>*/}
            {/*  <div className="text-muted" style={{*/}
            {/*    margin: "auto",*/}
            {/*    textAlign: 'justify'*/}
            {/*  }}>*/}
            {/*    {hobbies}*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/* Classes */}
            <div className="classes group">
              <div className="heading">
                <h2 className="text-center">Classes</h2>
              </div>
              <Table style={{ textAlign: "left" }}>
                <thead>
                <tr className="cmodule">
                  <th/>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
                </thead>
                <tbody>
                {modules.map((module, key) => {
                  return (
                    <tr className="cmodule" key={key}>
                      <td>
                        {module.completed === 1 ?
                          <FontAwesomeIcon className="text-success" icon={completedIcon}/> :
                          (module.completed === 0 ?
                            <FontAwesomeIcon className="text-secondary" icon={pendingIcon}/>
                            : <FontAwesomeIcon className="text-secondary" icon={pendingIcon}/>)}
                      </td>
                      <th><a href={links[module.year]} target="_blank" rel="noopener noreferrer">{module.code}</a></th>
                      <td>{module.name}</td>
                      <td>{module.description}</td>
                    </tr>
                  );
                })}
                </tbody>
              </Table>
            </div>
          </div>
        </section>
        <Footer/>
        {/* {this.state.langModal &&
        <Modal title="Languages" toggle={this.toggleLang}>
          <div className="text-muted" style={{ marginBottom: '5px' }}>
            <div style={{ textAlign: 'center' }}>
              Please note that these are rough estimates
            </div>
          </div>
          <Table style={{ textAlign: "left", margin: "auto", fontSize: '15px' }}>
            <thead>
            <tr className="popup-table">
              <th width={10}/>
              <th>Name</th>
              <th>Small Projects</th>
              <th>Large Projects</th>
            </tr>
            </thead>
            <tbody>
            {languageDetails.map((entry, index) => {
              return (
                <tr className="popup-table" key={index}>
                  <th>{index + 1}</th>
                  <td>{entry.name}</td>
                  <td>{entry.small}</td>
                  <td>{entry.large}</td>
                </tr>
              );
            })}
            </tbody>
          </Table>
          <hr style={{ marginTop: '0' }}/>
          <div className="container text-muted">
            <div style={{ fontWeight: '400', color: 'black' }}>
              Additionally familiar with:
            </div>
            {languageExtra.join(', ')}
            <br/>
            <div style={{ marginTop: '8px' }}>
              - Small: projects done roughly over a week / weekend
              <br/>
              - Large: projects done over the span of weeks / months
            </div>
          </div>
          <br/>
        </Modal>}
        {this.state.techModal &&
        <Modal title="Technologies" toggle={this.toggleTech}>
          <div className="text-muted" style={{ marginBottom: '5px' }}>
            <div style={{ textAlign: 'center' }}>
              A list of frameworks and technologies I have previously worked with
              in no particular order.
            </div>
          </div>
          <br/>
        </Modal>} */}
      </Fragment>
    );
  }
}

export default ResumePage;
