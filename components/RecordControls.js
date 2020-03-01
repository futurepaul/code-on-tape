import { useRef } from "react";
import { useEffect } from "react";
import Help from "./Help";
import AudioRecorder from "./AudioRecorder";

function decimalToTime(ms) {
  let fmtTime = new Date(ms).toISOString().substr(11, 8);

  if (ms >= 3600000) {
    return fmtTime;
  } else {
    //remove the hours
    fmtTime = fmtTime.substring(3);

    if (ms >= 600000) {
      return fmtTime;
    } else {
      //remove the tens minute
      return fmtTime.substring(1);
    }
  }
}

const RecordControls = ({ onClickRecord, cursor, timeSoFar }) => {
  return (
    <>
      <div className="controls">
        <div className="actual-controls">
          <AudioRecorder onClickRecord={onClickRecord} />
          <div className="time">{decimalToTime(timeSoFar)}</div>
          <div>{`line: ${cursor.lineNumber} column: ${cursor.column}`}</div>
        </div>

        <div className="spacer"></div>
        <Help>
          <strong>Help</strong>
          <p>
            Click <em>Record</em> to start recording your audio annotation. Then
            start clicking through your code so people know where you're at.
          </p>
          <p>
            Once you're done recording, click <em>Stop Recording</em> and you'll
            get a chance to preview your recording before uploading.
          </p>
          <p>
            <strong>Warning:</strong> I haven't tested recording anything longer
            than a few minutes, so don't record an audiobook probably!
          </p>
        </Help>
      </div>
      <style jsx>{`
        .actual-controls {
          flex-size: 10;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }

        .controls {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
        .time {
          margin-right: 1rem;
        }

        button {
          border: solid 1px black;
          background-color: #00ffff;
          margin: 1rem;
        }

        button.active {
          background-color: red;
        }
      `}</style>
    </>
  );
};

export default RecordControls;
