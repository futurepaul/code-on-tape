import { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";

const Audio = () => {
  const [playhead, setPlayhead] = useState(0);

  const onTimeUpdate = t => {
    let ms = Math.round(t * 1000);
    console.log(ms);
    setPlayhead(ms);
  };
  return (
    <AudioPlayer onTimeUpdate={onTimeUpdate} audioSrcUrl="coloradogirl.mp3" />
  );
};

export default Audio;
