import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import Footer from "../components/Footer";
import "../assets/Arcade.css"
import Placeholder from "../components/Placeholder";
import {Button} from "reactstrap";
import Image from "../components/Image";

const cards = [
  {
    title: "Stock Dashboard",
    description: "Analysis of stocks from indexes",
    img: "https://lh3.googleusercontent.com/pw/ACtC-3cz2cDxxogDS0UDCnWD_rUsN4YPzlkp9RswX1bzliCqzaKz0WS9XZwvxQM4S5ztWpY22R7o42WWa6HMVVjVQKGTuZTDuTTdwR42FZ4yOBmElti7Ud0tu_ioKgvCBqh09SqQA7bQqwoIf4i65xTxe1hA=w720-h405",
    link: "sandbox/stocks",
  },
  {
    title: "Pawn Race",
    description: "A chess variant with only pawns",
    img: "https://lh3.googleusercontent.com/pw/ACtC-3d7fd7hfXKe7Y3KvuMXCKbblWV_ced0futGrTMWS-NlJOFgUhFRDsuBeRcgcKLC4hpGLIpBCCRK5_uw6YamMUBDnU6pXlZVAauKYHxUnssfdi2UPu6ZDN0UMLWip1lZ5JaPRP9nyb6yKRAkVpJbbYHO=w1065-h599",
    link: "sandbox/chess",
  },
  // {
  //   title: "Weblike",
  //   description: "A roguelike dungeon crawler",
  //   img: "https://lh3.googleusercontent.com/pw/ACtC-3cYvKNZJpVc0Q0XnRsiM2-c8ObvhpaG-II7JCnlyr1B0b4h71-EkwgyCBhL89Cohz4OPsC-oXSTcvMnt0MtLDajI2P-KX7htnWuG3ZhHRkLkaxCGcs-nYDB79XeeWVjsBV0BRiRxi3WcO3qZoIe2lOS=w320-h180",
  //   link: "sandbox/roguelike",
  // },
  {
    title: "Snake",
    description: "The classic",
    img: "https://lh3.googleusercontent.com/pw/ACtC-3cm2fE86vL4T6eQdcplTEhWAA7E6cOLM9v5kYaTySRdifcU7LMFElxrivu-HwfC_swYuJRc4zhkunKQCvGKJ9hOm6hHb4t0GdzCnO3-oIyCDPFedf1b-zdU8IEyv44cF4BMzAelZu6K9P40dKurOfbK=w1301-h731",
    link: "sandbox/snake",
  },
  {
    title: "Cave Generator",
    description: "Cellular Automata",
    img: "https://lh3.googleusercontent.com/pw/ACtC-3fWyu5XkGuUMw717XCo8bANgnFv7K9Q2UbVyLhKXWfOwlbekxM32VljhUiKJKtgfCSaDYosby_zLvncMqGrHGhRfwMLvdyWwfMgzZlREmAMrup7yDYOp5kG2ZzANTf6oM7sYVeVdTCKUV8O_FUtHd8V=w1281-h721",
    link: "sandbox/cavegen",
  },
  {
    title: "Space Shooter",
    description: "Old school",
    img: "https://lh3.googleusercontent.com/pw/ACtC-3dedFWEmNFMxJQuzbFOhHIamo9nppcldlCT3cByHBKnACvoDokNNAaYS3vyYXQFwuFPKjZmrIAj8rkqAv6VRodWHdTfbWFuQ5lXL4DryrYE7Rb_QuQKTAaDx9RAyxJAQjJfMgVmnHki1ngmDP9s3r7p=w576-h324",
    link: "sandbox/spaceshooter",
  }
];

class ArcadePage extends Component {

  componentDidMount() {
    window.scroll(0, 0);
    document.title = "Sandbox"
  }

  render() {
    return (
      <Fragment>
        <div className="container" style={{ minHeight: "100vh" }}>
          <div className="heading">
            <h2>Sandbox</h2>
          </div>
          <div className="row">
            {cards.map((card, key) => {
              return (
                <div key={key} className="col-md-6 col-lg-4 mb-5">
                  <div className="card border-0 card-img-custom" style={{ backgroundColor: "transparent" }}>
                    <Image classes="card-img-top border-bottom" transition="visibility 0s, opacity 0.65s ease-in-out"
                           src={card.img} placeholder={<Placeholder classes="placeholder border-bottom"/>}/>
                    <div className="card-body text-center text-muted">
                      <h6 className="text-center" style={{ color: '#007bff', fontWeight: '600' }}>
                        {card.title}
                      </h6>
                      <p className="text-center card-text">{card.description}</p>
                      <div>
                        <Link to={card.link}>
                          <Button style={{ paddingLeft: '20px', paddingRight: '20px' }} size="sm" color="info">
                            Go
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <Footer/>
      </Fragment>
    );
  }
}

export default ArcadePage;