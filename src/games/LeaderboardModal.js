import React from "react";
import {Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";
import Skeleton from "@material-ui/lab/Skeleton";
import Modal from "../components/Modal";

function LeaderboardModal(props) {
  return (
    <Modal title="Leaderboard" toggle={props.toggleHighScores}>
      <Table style={{ textAlign: "left", margin: "auto" }}>
        <thead>
        <tr>
          <th width={10}/>
          <th width={10}/>
          <th>Name</th>
          <th>Score</th>
        </tr>
        </thead>
        <tbody>
        {props.leaderboard.map((entry, index) => {
          return (
            <tr key={index}>
              <th>
                {index === 0 ? (
                  <FontAwesomeIcon
                    style={{ color: "#d4af37" }}
                    icon={faCrown}
                  />
                ) : index === 1 ? (
                  <FontAwesomeIcon
                    style={{ color: "#aaa9ad" }}
                    icon={faCrown}
                  />
                ) : index === 2 ? (
                  <FontAwesomeIcon
                    style={{ color: "#b08d57" }}
                    icon={faCrown}
                  />
                ) : (
                  <FontAwesomeIcon
                    style={{ color: "#e5e4e2" }}
                    icon={faCrown}
                  />
                )}
              </th>
              <th>{index + 1}</th>
              <td>
                {props.loading ? (
                  <Skeleton/>
                ) : (
                  entry.username
                )}
              </td>
              <td>
                {props.loading ? (
                  <Skeleton/>
                ) : (
                  entry.score
                )}
              </td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </Modal>
  );
}

export default LeaderboardModal;