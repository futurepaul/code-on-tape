import React, { useContext, useEffect } from "react";
import EditorPlayback from "../components/EditorPlayback";
import EditorContext from "../context/editor/editorContext";
import EditorMonaco from "../components/EditorMonaco";
import AppContext from "../context/app/appContext";
// import Controls from "../../components/Controls";

const Play = () => {
  const editorContext = useContext(EditorContext);
  const appContext = useContext(AppContext);

  const { setCurrentLine } = editorContext;

  const setLineToFour = () => {
    setCurrentLine(4);
  };

  // useEffect(() => {
  //   console.log(events);
  //   console.log(playbackIndex);
  //   console.log(events[playbackIndex]);
  // });

  // useAnimationFrame((deltaTime, startTime) => {
  //   let diff = performance.now() - startTime;

  //   if (playbackIndex > events.length) {
  //     console.log("greater than");
  //     return;
  //   }

  //   // Pass on a function to the setter of the state
  //   // to make sure we always have the latest state

  //   if (diff >= events[playbackIndex].time) {
  //     setCurrentLine(events[playbackIndex].line);
  //     nextPlaybackIndex();
  //   }

  //   // if (count == 10 && !set) {
  //   //   console.log(count);
  //   //   setCurrentLine(10);
  //   //   setSet(true);
  //   // }

  //   // setCount(prevCount => prevCount);
  //   // console.log(deltaTime, startTime);
  //   // setCount(prevCount => prevCount);
  // });

  // https://css-tricks.com/using-requestanimationframe-with-react-hooks/

  return (
    <div>
      <button>Play</button>
      <button onClick={setLineToFour}>Set line to 4</button>
      <div>{Math.round(count)}</div>

      <EditorMonaco />
    </div>
  );
};

export default Play;
