import React from "react";
import {Button} from "reactstrap";

function CookieBanner(props) {
  return (
    <div style={{
      backgroundColor: "#f4f5f6",
      opacity: '0.97',
      borderTop: "1px solid #c7c7c7",
      padding: "25px 10px",
      justifyContent: "center",
      position: "fixed",
      left: "0",
      bottom: "0",
      width: "100%",
      zIndex: '2',
      display: "inline-flex"
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: "left",
        marginRight: "30px"
      }}>
        This website uses cookies to improve your experience.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button onClick={props.toggle} size="sm" color="primary" className="text-nowrap"
                style={{ minWidth: '100px', paddingTop: '2px', paddingBottom: '2px' }}>
          Got it!
        </Button>
      </div>
    </div>
  );
}

export default CookieBanner;