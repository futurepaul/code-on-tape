import { useState } from "react";
import PlaybackEditor from "../components/Editor/PlaybackEditor";
import AudioPlayer from "../components/AudioPlayer";
import Tabs from "../components/Tabs";

const Play = ({ gistID, files, eventLog }) => {
  const [cursor, setCursor] = useState({ lineNumber: 1, column: 1 });
  const [activeTab, setActiveTab] = useState(0);

  const onTimeUpdate = t => {
    let ms = Math.round(t * 1000);
    let index = Math.round(t);
    if (index < eventLog.length) {
      let event = eventLog[Math.round(t)];
      setCursor({ lineNumber: Math.round(t), column: cursor.column });
      setCursor(event.cursor);
      setActiveTab(event.tab);
    } else {
      console.log("we're out of events!");
    }
  };

  return (
    <div>
      <AudioPlayer
        onTimeUpdate={onTimeUpdate}
        audioSrcUrl="/coloradogirl.mp3"
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
