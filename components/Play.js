import { useState, useRef, useEffect } from "react";
import Editor from "../components/Editor/Editor";
import AudioPlayer from "../components/AudioPlayer";
import Tabs from "../components/Tabs";

function findClosestEvent(scrubTime, events) {
  const length = events.length;
  const totalTime = events[length - 1].time;
  let guess = Math.floor((scrubTime / totalTime) * length);

  // console.log(`length: ${length}, totalTime: ${totalTime}, guess: ${guess}`);

  while (guess > 0 && guess < length - 1) {
    if (
      scrubTime <= events[guess + 1].time &&
      scrubTime >= events[guess].time
    ) {
      break;
    } else if (scrubTime > events[guess + 1].time) {
      guess += 1;
    } else if (scrubTime < events[guess].time) {
      guess -= 1;
    } else {
      break;
    }
  }

  return Math.min(guess, length - 1);
}

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
  // console.log(`delay: ${delay}, ct: ${currentTime}, st: ${startTime}`);
  return delay;
}

const Play = ({ gistID, files, eventLog, audio }) => {
  // Meta playback state
  const [playbackStartTime, setPlaybackStartTime] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [following, setFollowing] = useState(true);
  const [interval, setNextInterval] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [postScrub, setPostScrub] = useState(false);

  // Current playback state
  const [cursor, setCursor] = useState({ lineNumber: 1, column: 1 });
  const [activeTab, setActiveTab] = useState(0);
  const [index, setIndex] = useState(0);
  const [roughPlaybackTime, setRoughPlaybackTime] = useState(0);

  const onPostScrub = () => {
    let t = roughPlaybackTime;
    let ms = Math.round(t * 1000);
    console.log(ms);
    let newIndex = findClosestEvent(ms, eventLog);
    let event = eventLog[newIndex];
    setPlaybackStartTime(performance.now() - event.time);
    console.log(event);
    setIndex(newIndex);
    setCursor(event.cursor);
    setActiveTab(event.tab);
  };

  const startPlaying = () => {
    if (!playing && index < eventLog.length - 1) {
      setNextInterval(eventLog[index + 1].time);
      setPlaybackStartTime(performance.now() - eventLog[index].time);
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  };

  useInterval(
    () => {
      if (index + 1 < eventLog.length) {
        let currentEvent = eventLog[index];
        if (following) {
          setActiveTab(currentEvent.tab);
          setCursor(currentEvent.cursor);
        }
        setNextInterval(
          calculateDelay(playbackStartTime, eventLog[index + 1].time)
        );
        setIndex(index + 1);
      } else {
        let currentEvent = eventLog[index];
        if (following) {
          setActiveTab(currentEvent.tab);
          setCursor(currentEvent.cursor);
        }
        setPlaying(false);
      }
    },
    playing ? interval : null
  );

  const requestActiveTab = id => {
    setActiveTab(id);
  };

  // const onTimeUpdate = t => {

  //   // if (isScrubbing) {
  //   //   let ms = Math.round(t * 1000);
  //   //   let newIndex = findClosestEvent(ms, eventLog);
  //   //   let event = eventLog[newIndex];
  //   //   setIndex(newIndex);
  //   //   setCursor(event.cursor);
  //   //   setActiveTab(event.tab);
  //   // }
  // };

  return (
    <div>
      <AudioPlayer
        onTimeUpdate={setRoughPlaybackTime}
        onClickPlay={startPlaying}
        audioSrcUrl={audio ? audio : "/coloradogirl.mp3"}
        onMouseDown={() => setIsScrubbing(true)}
        onMouseUp={onPostScrub}
      />
      <Tabs
        activeTab={activeTab}
        requestActiveTab={requestActiveTab}
        files={files}
      />
      <Editor
        gist={files}
        tabID={activeTab}
        cursor={cursor}
        onCursorChange={e => console.log("on cursor change:" + e)}
      />
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
