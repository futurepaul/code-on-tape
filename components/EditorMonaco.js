import React, {
  useRef,
  useLayoutEffect,
  useState,
  useContext,
  useEffect
} from "react";
import ReactDOM from "react-dom";
import EditorContext from "../context/editor/editorContext";

import Monaco from "@monaco-editor/react";

const Editor = ({ gistID, gists, currentLine }) => {
  // const editorContext = useContext(EditorContext);

  // const { value, currentLine } = editorContext;

  const editorRef = useRef(null);
  // const [lineNumber, setLineNumber] = useState(0);
  // const [inputLine, setInputLine] = useState(7);
  // const [inputColumn, setInputColumn] = useState(5);

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;

    // Now you can use the instance of monaco editor
    // in this component whenever you want
  }

  function listenEditorChanges() {
    editorRef.current.onDidChangeModelContent(ev => {
      console.log(editorRef.current.getValue());
    });

    editorRef.current.onDidChangeCursorPosition(ev => {
      console.log(ev.position);
    });
  }

  useEffect(() => {
    editorRef.current.getValue();
  }, [currentLine, editorRef]);

  const setCursor = (lineNumber, column) => {
    let cursor = {
      lineNumber,
      column
    };
    editorRef.current.setPosition(cursor);
    editorRef.current.focus();
  };

  return (
    <>
      <button onClick={listenEditorChanges} disabled={!!editorRef.current}>
        Press to listen editor changes (see console)
      </button>
      <Monaco
        editorDidMount={handleEditorDidMount}
        height="90vh"
        value={gists[0].content}
        options={{
          language: "javascript",
          minimap: { enabled: false },
          theme: "vs-dark",
          fontSize: 16,
          readOnly: true,
          cursorStyle: "underline-thin"
        }}
      />
    </>
  );
};

export default Editor;
