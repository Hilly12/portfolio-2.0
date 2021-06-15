import React from 'react';
import {Button, Form, FormGroup, Spinner} from "reactstrap";
import TextField from "@material-ui/core/TextField";
import Modal from "../components/Modal";

function GameOverModal(props) {
  return (
    <Modal title="Game Over" toggle={() => props.toggleGameOver(props.score, props.threshold)}>
      <br/>
      <p className="text-muted" style={{ textAlign: "center" }}>
        You scored {props.score} points
      </p>
      {props.score < props.threshold ?
        <p className="text-muted" style={{ textAlign: "center" }}>
          Score over {props.threshold} to qualify for the leaderboard
        </p> :
        null}

      <br/>
      <Form>
        <FormGroup>
          <TextField
            disabled={props.score < props.threshold || props.loading}
            value={props.dname}
            helperText={props.helperText}
            id="dname"
            color="primary"
            size="small"
            label="Name"
            variant="outlined"
            onChange={props.onChange}
            error={props.error}
            autoComplete="off"
          />
        </FormGroup>
        <Button
          color="primary"
          disabled={
            props.score < props.threshold ||
            props.loading ||
            props.error ||
            props.dname.trim() === ""
          }
          onClick={() => props.submitScore(props.game_id, props.score)}
          size="sm"
        >
          Submit to Leaderboard
          {props.loading ? (
            <Spinner className="ml-1" size="sm"/>
          ) : null}
        </Button>
      </Form>
      <br/>
    </Modal>
  );
}

export default GameOverModal;