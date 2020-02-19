import dynamic from "next/dynamic";

let MonacoEditor = null;

if (process.browser && !MonacoEditor) {
  MonacoEditor = dynamic(() => import("../../components/Editor/EditorRaw"), {
    ssr: false
  });
}

const RecordEditor = ({ gist, tabID, cursor, onCursorChange }) => {
  // console.log(`RecordEditor active tab: ${tabID}`);
  if (!MonacoEditor) {
    return <div></div>;
  }

  return (
    <div>
      <MonacoEditor
        language="javascript"
        theme="vs-light"
        value={gist[tabID].content}
        options={{
          selectOnLineNumbers: true,
          minimap: { enabled: false },
          automaticLayout: true,
          readOnly: true
        }}
        editorDidMount={e => console.log(e)}
        cursor={cursor}
        cursorChange={onCursorChange}
      />
    </div>
  );
};

export default RecordEditor;
