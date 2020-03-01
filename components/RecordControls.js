import { useRef } from "react";
import { useEffect } from "react";
import Help from "./Help";
import AudioRecorder from "./AudioRecorder";

const Meter = ({ level }) => {
  let ref = useRef();

  useEffect(() => {
    let canvas = ref.current;
    let context = canvas.getContext("2d");
    context.beginPath();
    context.arc(50, 50, 50, 0, 2 * Math.PI);
    context.fill();
  });

  return <canvas ref={ref} style={{ width: "100px", height: "30px" }} />;
};

const ProgressBar = ({ progress }) => (
  <div>
    <style jsx>{`
      .background {
        background-color: pink;
        width: 100px;
        margin-right: 1rem;
      }
      .foreground {
        background-color: red;
        width: ${progress}%;
      }
    `}</style>
    <div className="background">
      <div className="foreground">hey</div>
    </div>
  </div>
);

const RecordControls = ({
  onClickRecord,
  onHasMediaUrl,
  isRecording,
  cursor
}) => {
  return (
    <>
      <div className="controls">
        <div className="actual-controls">
          {/* <button className={isRecording && "active"} onClick={onClickRecord}>
            {isRecording ? "Stop Recording" : "Record"}
          </button> */}
          <AudioRecorder
            onClickRecord={onClickRecord}
            onHasMediaUrl={onHasMediaUrl}
          />
          <div className="time">0:00</div>
          <ProgressBar progress={90} className="progress" />
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

        .progress {
          margin: 1rem;
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
