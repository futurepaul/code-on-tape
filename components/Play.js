import { useState, useRef, useEffect } from "react";
import PlaybackEditor from "../components/Editor/PlaybackEditor";
import AudioPlayer from "../components/AudioPlayer";
import Tabs from "../components/Tabs";

function findClosestEvent(scrubTime, events) {}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function calculateDelay(startTime, stamp) {
  let currentTime = performance.now();

  let delay = Math.floor(stamp - (currentTime - startTime));
  if (delay < 1) {
    delay = 1;
  }
  console.log(`delay: ${delay}, ct: ${currentTime}, st: ${startTime}`);
  return delay;
}

const Play = ({ gistID, files, eventLog, audio }) => {
  // console.log("audioURL" + audio);

  // Meta playback state

  // const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [playbackStartTime, setPlaybackStartTime] = useState(null);
  // const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [interval, setNextInterval] = useState(0);
  // const [playheadTime, setPlayheadTime] = useState(0);

  // Current playback state
  const [cursor, setCursor] = useState({ lineNumber: 1, column: 1 });
  const [activeTab, setActiveTab] = useState(0);
  const [index, setIndex] = useState(0);

  const startPlaying = () => {
    console.log(eventLog);
    if (!playing) {
      setNextInterval(eventLog[1].time);
      // setColor(eventLog[0].color);
      setIndex(0);
      setPlaybackStartTime(performance.now());
      setPlaying(true);
    } else {
      setIndex(0);
      setPlaying(false);
    }
  };

  useInterval(
    () => {
      // setPlayheadTime(performance.now() - playbackStartTime);
      console.log(eventLog[index]);
      if (index + 1 < eventLog.length) {
        let currentEvent = eventLog[index];
        setCursor(currentEvent.cursor);
        setActiveTab(currentEvent.tab);
        setNextInterval(
          calculateDelay(playbackStartTime, eventLog[index + 1].time)
        );
        setIndex(index + 1);
      } else {
        let currentEvent = eventLog[index];
        setCursor(currentEvent.cursor);
        setActiveTab(currentEvent.tab);
        setPlaying(false);
      }
    },
    playing ? interval : null
  );

  const onTimeUpdate = t => {
    console.log(t);
    let ms = Math.round(t * 1000);
    if (ms < eventLog[index].time) {
    } else if (ms > eventLog[index].time) {
    }
    // let index = Math.round(t);
    // if (index < eventLog.length) {
    //   let event = eventLog[Math.round(t)];
    //   setCursor({ lineNumber: Math.round(t), column: cursor.column });
    //   setCursor(event.cursor);
    //   setActiveTab(event.tab);
    // } else {
    //   console.log("we're out of events!");
    // }
  };

  return (
    <div>
      <AudioPlayer
        onTimeUpdate={onTimeUpdate}
        onClickPlay={startPlaying}
        audioSrcUrl={audio ? audio : "/coloradogirl.mp3"}
      />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} files={files} />
      <PlaybackEditor gist={files} tabID={activeTab} cursor={cursor} />
      <style jsx>{`
        .nav {
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;
          border-bottom: 2px solid black;
          padding-left: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Play;
