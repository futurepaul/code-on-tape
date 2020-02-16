import React, { useContext, useEffect } from "react";
// import EditorPlayback from "../components/EditorPlayback";
import AudioPlayer from "../../components/AudioPlayer";
import EditorContext from "../../context/editor/editorContext";
// import EditorMonaco from "../../components/EditorMonaco";
// import Editor from "../../components/Editor/Editor";
// import Editor from "../../components/Editor/Editor";
// import { CodeEditor } from "../../components/CM2/Editor";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../../components/Editor/EditorRaw"), {
  ssr: false
});

import AppContext from "../../context/app/appContext";

import { myFakeJson } from "../../fake_data";
// import Controls from "../../components/Controls";

const Play = ({ gistID, gists }) => {
  const editorContext = useContext(EditorContext);
  const appContext = useContext(AppContext);

  const { setCurrentLine, currentLine } = editorContext;

  const setLineToFour = () => {
    setCurrentLine(4);
  };

  const onTimeUpdate = t => {
    let ms = Math.round(t * 1000);
    console.log(ms);
    setCurrentLine(currentLine + 1);
  };

  const changeFunc = () => {};

  if (gists != null) {
    return (
      <div>
        <AudioPlayer
          onTimeUpdate={onTimeUpdate}
          audioSrcUrl="coloradogirl.mp3"
        />

        {/* <EditorMonaco gistID={gistID} gists={gists} currentLine={currentLine} /> */}
        <Editor
          value={gists[0].content}
          cursor={{ lineNumber: 0, column: 0 }}
          onEditorCursorMove={() => {}}
        />
        <div>
          {/* <Editor value={gists[0].content} onChange={changeFunc} /> */}
        </div>
      </div>
    );
  } else {
    return "Didn't get good gists bro";
  }
};

const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID;
const client_secret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
// const query = "7c09ce3491dcfb9ca103bc46127435d4";

Play.getInitialProps = async ctx => {
  let query = ctx.query.id;
  try {
    // let url = `https://api.github.com/gists/${query}?client_id=${client_id}&client_secret=${client_secret}`;
    // const res = await fetch(url);
    // let json = await res.json();
    // let gistFiles = json.files;

    // let gists = Object.keys(gistFiles).map(key => gistFiles[key]);
    let gists = myFakeJson;
    return { gistID: query, gists: gists };
  } catch (error) {
    console.error(error);
    return {
      gistID: null,
      gists: null
    };
  }
};

export default Play;
