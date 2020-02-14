import { useState } from "react";
import dynamic from "next/dynamic";
// const [editorState] = useSubscribe(editorStore)

let MonacoEditor = null;

if (process.browser && !MonacoEditor) {
  MonacoEditor = dynamic(() => import("../../components/Editor/EditorRaw"), {
    ssr: false
  });
}

const Editor = ({ value }) => {
  const [code, setCode] = useState("");
  const [cursor, setCursor] = useState(null);

  if (!MonacoEditor) {
    return <div></div>;
  }

  // useEffect(() => {
  //   setCode(codeFactory.generateCode(editorState.components))
  // }, [editorState])

  if (value != null) {
    return (
      <div>
        <button onClick={() => setCursor({ lineNumber: 10, column: 0 })}>
          Set cursor
        </button>
        <MonacoEditor
          language="javascript"
          theme="vs-dark"
          value={value}
          cursor={cursor}
          options={{ selectOnLineNumbers: true, minimap: { enabled: false } }}
          editorDidMount={e => console.log(e)}
          cursorChange={e => console.log(e)}
        />
      </div>
    );
  } else {
    return <div>Didn't get good gists bro</div>;
  }
};

export default Editor;
