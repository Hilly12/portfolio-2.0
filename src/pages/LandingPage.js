import React, {Component, Fragment} from "react";
import Footer from "../components/Footer";
import {Button, FormGroup, Spinner} from "reactstrap";
import Avatar from "@material-ui/core/Avatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLinkedinIn} from "@fortawesome/free-brands-svg-icons/faLinkedinIn";
import {faFacebookF} from "@fortawesome/free-brands-svg-icons/faFacebookF";
import {faFileAlt} from "@fortawesome/free-solid-svg-icons/faFileAlt";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import TypingEffect from "typing-effect-react"
import Modal from "../components/Modal";
import Form from "reactstrap/es/Form";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import axios from "axios";
import {faCode} from "@fortawesome/free-solid-svg-icons/faCode";
import {faAddressCard} from "@fortawesome/free-solid-svg-icons/faAddressCard";
import {faDragon} from "@fortawesome/free-solid-svg-icons/faDragon";
import {faCommentAlt} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.OnLoaded = this.OnLoaded.bind(this);
    this.toggleContact = this.toggleContact.bind(this);
    this.submit = this.submit.bind(this);
    this.success = this.success.bind(this);
    this.fail = this.fail.bind(this);
    this.state = {
      loading: true,
      contactModal: false
    }
  }

  componentDidMount() {
    window.scroll(0, 0);
    document.title = "Aahil Mehta"
  }

  OnLoaded() {
    this.setState({ loading: false });
  }

  toggleContact() {
    this.setState({
      contactModal: !this.state.contactModal,
      helperText: " ",
      dname: "",
      mailid: "",
      message: "",
      submitLoading: false,
      error: false
    });
  }

  submit() {
    this.setState({
      submitLoading: true
    });
    const message = this.state.message;
    const email = this.state.mailid;
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    if (!regex.test(email)) {
      this.fail("Invalid email");
    } else if (message.length > 10000) {
      this.fail("Please keep your message under 10000 characters");
    } else {
      axios.post("https://formspree.io/xeqryezk", {
        headers: {
          'Accept': 'application/json'
        },
        data: {
          name: this.state.dname,
          email: this.state.mailid,
          message: this.state.message
        }
      }).then((response) => {
        console.log(response);
        this.success();
      }).catch((error) => {
        console.log(error.response);
        this.fail("Unable to connect to server");
      });
    }
  }

  success() {
    this.setState({
      changes: "Thank you, will get back as soon as I can :)",
      success: true,
      submitLoading: false,
      contactModal: false,
    });
  }

  fail(message) {
    this.setState({
      submitLoading: false,
      errors: true,
      helperText: "* " + message
    });
  }

  dismissSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      success: false,
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      errors: false
    });
  }

  render() {
    return (
      <Fragment>
        {/*<div className="splash-screen" style={{*/}
        {/*  visibility: `${this.state.loading ? 'visible' : 'hidden'}`,*/}
        {/*  opacity: `${this.state.loading ? '1' : '0'}`,*/}
        {/*  transition: 'visibility 0s, opacity 0.5s ease-out'*/}
        {/*}}>*/}
        {/*  <div className="splash-screen-inner">*/}

        {/*  </div>*/}
        {/*</div>*/}
        <div className="container" style={{
          visibility: `${this.state.loading ? 'hidden' : 'visible'}`,
          opacity: `${this.state.loading ? '0' : '1'}`,
          transition: 'visibility 0s, opacity 0.65s ease-in',
          minHeight: "100vh"
        }}>
          <div className="container" style={{ marginTop: '30px', paddingTop: '1em' }}>
            {/* <div className="heading" style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '20pt' }}>{' '}Aahil Mehta</span>
            </div> */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img className="brand-img noselect"
                   src="https://lh3.googleusercontent.com/pw/AMWts8Agkq-YRzPWNHmYRjRd_zpFQbH_XJJftka81pJkb6v1WwP_3rXuHnC4AgLA7eHsONiXqgryHbCQizOU_0saj-5m15LKYahDdSDtXmcBLiYyLM354qvOxdGTd2Lqua6GafkeuOlPVW1Abcor8LzWJXR6gQ=s639-no"
                   alt="" onLoad={this.OnLoaded}/>
            </div>
            <div style={{ margin: '25px 0 0 0' }}>
              {/* <span className="lead">Software Engineer</span> */}
              <TypingEffect className="lead" typingSpeed={50} pauseBeforeDeleting={4000} pauseBeforeRestarting={50}
                            data={["Software Engineer", "Machine Learning Engineer", "Full Stack Developer"]}/>
            </div>
            {/*<p className="bio">Hi</p>*/}
            {/*<br className="noselect"/>*/}
            <br className="noselect"/>
            <hr className="my-2"/>
            <div className="text-muted nav-info" style={{ margin: '5px 0 5px 0' }}>
              <p><Link to="/projects"><FontAwesomeIcon icon={faCode} style={{ minWidth: '30px' }}/>Projects</Link></p>
              <p><Link to="/resume"><FontAwesomeIcon icon={faAddressCard} style={{ minWidth: '30px' }}/>Resume</Link></p>
              <p><Link to="/sandbox"><FontAwesomeIcon icon={faDragon} style={{ minWidth: '30px' }}/>Sandbox</Link></p>
              <p><Link to="/blog"><FontAwesomeIcon icon={faCommentAlt} style={{ minWidth: '30px' }}/>Blog</Link></p>
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
          <br className="noselect"/>
          <div className="text-muted" style={{ textAlign: "center", marginTop: '10px' }}>
            <button onClick={this.toggleContact} style={{ borderRadius: '50px', minWidth: '150px' }}
                    className="btn btn-git">Get in touch
            </button>
          </div>
          <br className="noselect"/>
        </div>
        <Footer/>
        {this.state.contactModal &&
        <Modal title="Contact" toggle={this.toggleContact} height={450}>
          <h6>
            {/*Get in touch*/}
          </h6>
          <Form style={{ padding: '0.5em' }}>
            <FormGroup>
              <TextField
                id="dname"
                label="Name"
                color="primary"
                fullWidth
                size="small"
                variant="outlined"
                autoComplete="off"
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="mailid"
                label="Email"
                color="primary"
                fullWidth
                size="small"
                variant="outlined"
                autoComplete="off"
                error={this.state.error}
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="message"
                label="Message"
                fullWidth
                multiline
                size="small"
                rows={9}
                variant="outlined"
                autoComplete="off"
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup>
              <div style={{ textAlign: 'left', fontSize: '12', color: '#ff0000' }}>
                {this.state.helperText}
              </div>
            </FormGroup>
            <Button color="primary" onClick={this.submit} size="sm"
                    disabled={this.state.message.trim() === "" || this.state.mailid.trim() === "" || this.state.dname.trim() === ""}>
              Submit
              {this.state.submitLoading ? (
                <Spinner className="ml-1" size="sm"/>
              ) : null}
            </Button>
          </Form>
          <br/>
        </Modal>
        }
        <Snackbar
          open={this.state.success}
          autoHideDuration={2000}
          onClose={this.dismissSnackbar}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={this.dismissSnackbar}
          >
            {this.state.changes}
          </Alert>
        </Snackbar>
      </Fragment>
    );
  }
}

export default LandingPage;