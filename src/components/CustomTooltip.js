import React, {Fragment} from "react";
import {withStyles} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: 'white',
    color: '#333333',
    boxShadow: theme.shadows[2],
    fontSize: 12,
    fontFamily: 'Montserrat'
  },
}))(Tooltip);

export default function CustomTooltip(props) {
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