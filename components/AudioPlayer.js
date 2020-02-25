import React, { useState, useRef } from "react";

function decimalToTime(seconds, duration) {
  let fmtTime = new Date(1000 * seconds).toISOString().substr(11, 8);

  if (duration >= 3600) {
    return fmtTime;
  } else {
    //remove the hours
    fmtTime = fmtTime.substring(3);

    if (duration >= 600) {
      return fmtTime;
    } else {
      //remove the tens minute
      return fmtTime.substring(1);
    }
  }
}

const AudioPlayer = React.forwardRef(
  (
    { audioSrcUrl, onClickPlay, onMouseDown, onMouseUp, playing, setPlaying },
    audioPlayerEl
  ) => {
    const [muted, setMuted] = useState(false);
    const [timeString, setTimeString] = useState("0:00 / 0:00");
    const [progress, setProgress] = useState(0);

    // const audioPlayerEl = ref;

    const play = () => {
      onClickPlay();
      if (!playing) {
        audioPlayerEl.current.play();
        setPlaying(true);
      } else {
        audioPlayerEl.current.pause();
        setPlaying(false);
      }
    };

    const mute = () => {
      audioPlayerEl.current.muted = !muted;
      setMuted(!muted);
    };

    const timeUpdate = e => {
      let audio = audioPlayerEl.current;
      setProgress((100 * audio.currentTime) / audio.duration);

      // Report back to our parent
      // onTimeUpdate(audio.currentTime);

      // console.log("current time:" + audio.currentTime);

      let time = `${decimalToTime(
        audio.currentTime,
        audio.duration
      )} / ${decimalToTime(audio.duration, audio.duration)}`;

      setTimeString(time);

      if (audio.ended) setPlaying(false);
    };

    const playHeadInput = evt => {
      let audio = audioPlayerEl.current;
      const scrubPercent = evt.target.value;
      let scrubDestination = (scrubPercent / 100) * audio.duration;
      audio.currentTime = scrubDestination;
    };

    return (
      <>
        <div className="player">
          <audio
            ref={audioPlayerEl}
            src={audioSrcUrl}
            onTimeUpdate={timeUpdate}
          ></audio>
          <button className={`play ${playing && "playing"}`} onClick={play}>
            {playing ? "Pause" : "Play"}
          </button>
          <div className="time">{timeString}</div>
          <input
            className="playHead"
            value={progress}
            type="range"
            min="0"
            max="100"
            step=".1"
            onInput={playHeadInput}
            onChange={() => {}}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          />
          <button
            className={`mute ${muted && "muted"}`}
            onClick={mute}
          ></button>
        </div>
        <style jsx>{`
          .player {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
          }

          input[type="range"] {
            height: 1rem;
            -webkit-appearance: none;
            flex-grow: 1;
            padding-top: 1rem;
            padding-bottom: 1rem;
            padding-right: 3px;
            border: 1px solid white;
          }

          input[type="range"]:focus {
            outline: none;
          }

          input[type="range"]:-moz-focusring {
            outline: 1px solid white;
            outline-offset: -1px;
          }

          input[type="range"]::-webkit-slider-runnable-track {
            height: calc(1rem + 2px);
            box-shadow: 3px 3px grey;
            background-image: url(/svg/square.svg);
            background-size: var(--load-percentage) 100px;
            background-repeat: no-repeat;
            border-radius: 0px;
            border: 1px solid #000000;
          }

          input[type="range"]::-moz-range-track {
            height: calc(1rem + 2px);
            box-shadow: 3px 3px grey;
            background-image: url(/svg/square.svg);
            background-size: var(--load-percentage) 100px;
            background-repeat: no-repeat;
            border-radius: 0px;
            border: 1px solid #000000;
          }

          input[type="range"]::-webkit-slider-thumb {
            height: 1rem;
            width: 1rem;
            border-radius: 0px;
            background: black;
            -webkit-appearance: none;
          }

          input[type="range"]::-moz-range-thumb {
            height: 1rem;
            width: 1rem;
            border-radius: 0px;
            background: black;
            -webkit-appearance: none;
          }

          .player button {
            width: 1rem;
            height: 1rem;
            border: none;
            outline: none;
            background-repeat: no-repeat;
            background-position: center;
            padding: 1rem;
          }

          .time {
            width: 6rem;
            text-align: center;
            flex: none;
          }

          button.play {
            padding-left: 0rem;
            background-color: black;
            -webkit-mask: url(/svg/sharp-play_arrow-24px.svg) no-repeat 50% 50%;
            mask: url(/svg/sharp-play_arrow-24px.svg) no-repeat 50% 50%;
          }

          button.play.playing {
            -webkit-mask: url(/svg/sharp-pause-24px.svg) no-repeat 50% 50%;
            mask: url(/svg/sharp-pause-24px.svg) no-repeat 50% 50%;
          }

          button.mute {
            -webkit-mask: url(/svg/sharp-volume_up-24px.svg) no-repeat 50% 50%;
            background-image: url(/svg/sharp-volume_up-24px.svg);
          }

          button.mute.muted {
            -webkit-mask: url(/svg/sharp-volume_off-24px.svg) no-repeat 50% 50%;
            background-image: url(/svg/sharp-volume_off-24px.svg);
          }
        `}</style>
      </>
    );
  }
);

export default AudioPlayer;
