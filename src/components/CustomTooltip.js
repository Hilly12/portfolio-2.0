import React, {Fragment} from "react";
import {withStyles} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

export default function CustomTooltip(props) {
  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: props.backgroundColor ? props.backgroundColor : 'white',
      color: props.color ? props.color : '#333333',
      boxShadow: props.boxShadow ? props.boxShadow : theme.shadows[2],
      fontSize: props.fontSize ? props.fontSize : 12,
      fontFamily: props.fontFamily ? props.fontFamily : 'Montserrat'
    },
    tooltipPlacementTop: {
      margin: props.margin ? props.margin : "0",
    },
  }))(Tooltip);

  return (
    <Fragment>
      <LightTooltip title={props.tooltip} placement="right">
        <span className="tip" style={{ fontWeight: "600", color: "#585e63" }}>
          {props.children}
        </span>
      </LightTooltip>
      <p/>
    </Fragment>
  );
};