import React, { useContext, useEffect } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { xcode as hstyle } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import EditorContext from "../context/editor/editorContext";
import AppContext from "../context/app/appContext";

const Editor = ({ gistID, gists }) => {
  const editorContext = useContext(EditorContext);
  const appContext = useContext(AppContext);

  const {
    setGistID,
    setGists,
    value,
    currentLine,
    setCurrentLine
  } = editorContext;
  const { addEvent, startTime } = appContext;

  useEffect(() => {
    setGistID(gistID);
    setGists(gists);
  }, [gistID, gists]);

  return (
    <SyntaxHighlighter
      style={hstyle}
      showLineNumbers={true}
      wrapLines={true}
      lineNumberProps={{
        style: { color: "grey" }
      }}
      lineProps={lineNumber => ({
        style: {
          cursor: "pointer",
          display: "block",
          backgroundColor: lineNumber === currentLine ? "AntiqueWhite" : "white"
        },
        onClick() {
          setCurrentLine(lineNumber);
          console.log(startTime);
          addEvent({ time: Date.now() - startTime, line: lineNumber });
        }
      })}
    >
      {value}
    </SyntaxHighlighter>
  );
};

export default Editor;
