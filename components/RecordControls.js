import { useRef } from "react";
import { useEffect } from "react";

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

const RecordControls = ({ onClickRecord, isRecording, cursor }) => {
  return (
    <>
      <div className="controls">
        <button className={isRecording && "active"} onClick={onClickRecord}>
          {isRecording ? "Stop Recording" : "Record"}
        </button>
        <div className="time">0:00</div>
        <ProgressBar progress={90} className="progress" />
        <div>{`line: ${cursor.lineNumber} column: ${cursor.column}`}</div>
      </div>
      <style jsx>{`
        .controls {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
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
