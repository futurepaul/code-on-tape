import { useState, useRef, useEffect } from "react";
import Editor from "../components/Editor/Editor";
import AudioPlayer from "../components/AudioPlayer";
import Tabs from "../components/Tabs";
import useInterval from "../hooks/useInterval";

function findClosestEvent(scrubTime, events) {
  const length = events.length;
  const totalTime = events[length - 1].time;
  let guess = Math.floor((scrubTime / totalTime) * length);

  // console.log(`length: ${length}, totalTime: ${totalTime}, guess: ${guess}`);

  while (guess > 1 && guess < length - 1) {
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
  // Meta playback state
  const [playbackStartTime, setPlaybackStartTime] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [following, setFollowing] = useState(true);
  const [interval, setNextInterval] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const audioRef = useRef(null);

  // Current playback state
  const [cursor, setCursor] = useState({ lineNumber: 1, column: 1 });
  const [activeTab, setActiveTab] = useState(0);
  const [index, setIndex] = useState(0);

  // This is called after we release the slider of the aduio player.
  const onPostScrub = () => {
    audioRef.current.pause();
    setNextInterval(null);
    setPlaying(false);

    let t = audioRef.current.currentTime;
    let ms = Math.round(t * 1000);
    let newIndex = findClosestEvent(ms, eventLog);

    let event = eventLog[newIndex];

    setIndex(newIndex);
    setActiveTab(event.tab);
    setCursor(event.cursor);
  };

  const continuePlayback = () => {
    // let t = audioRef.current.currentTime;
    // let ms = Math.round(t * 1000);
    // let newIndex = findClosestEvent(ms, eventLog);

    if (index < eventLog.length - 1) {
      let newPlaybackStartTime = performance.now() - eventLog[index].time;
      let delay = calculateDelay(newPlaybackStartTime, eventLog[index].time);
      setPlaybackStartTime(newPlaybackStartTime);
      setNextInterval(delay);
    } else {
      setNextInterval(null);
      setPlaying(false);
    }
  };

  const startPlaying = () => {
    if (!playing) {
      audioRef.current
        .play()
        .then(() => {
          setPlaying(true);
          continuePlayback();
        })
        .catch(e => {
          console.error(e);
        });
    } else {
      setNextInterval(null);
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const onKeyPress = e => {
    if (e.charCode === 32) {
      startPlaying();
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
        let delay = calculateDelay(playbackStartTime, eventLog[index + 1].time);
        // let errorCalc =
        //   playbackStartTime + eventLog[index].time - performance.now();
        // console.log(`error amount: ${errorCalc}`);
        setNextInterval(delay);
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

  return (
    <div onKeyPress={onKeyPress}>
      <AudioPlayer
        onClickPlay={startPlaying}
        audioSrcUrl={audio ? audio : "/coloradogirl.mp3"}
        onMouseDown={() => setIsScrubbing(true)}
        onMouseUp={onPostScrub}
        ref={audioRef}
        playing={playing}
        setPlaying={setPlaying}
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
