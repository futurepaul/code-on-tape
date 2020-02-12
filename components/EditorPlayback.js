import React, { useContext, useEffect } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { xcode as hstyle } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import EditorContext from "../context/editor/editorContext";
import AppContext from "../context/app/appContext";

const EditorPlayback = () => {
  const editorContext = useContext(EditorContext);
  // const appContext = useContext(AppContext);

  const { value, currentLine } = editorContext;
  // const { addEvent, startTime } = appContext;

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
        }
      })}
    >
      {value}
    </SyntaxHighlighter>
  );
};

export default EditorPlayback;
