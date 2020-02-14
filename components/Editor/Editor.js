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

  if (!MonacoEditor) {
    return <div></div>;
  }

  // useEffect(() => {
  //   setCode(codeFactory.generateCode(editorState.components))
  // }, [editorState])

  if (value != null) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh"
        }}
      >
        <MonacoEditor
          language="javascript"
          theme="vs-dark"
          value={value}
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
