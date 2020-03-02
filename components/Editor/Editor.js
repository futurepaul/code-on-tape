import dynamic from "next/dynamic";

let MonacoEditor = null;

if (process.browser && !MonacoEditor) {
  MonacoEditor = dynamic(() => import("../../components/Editor/EditorRaw"), {
    ssr: false
  });
}

const Editor = ({ gist, tabID, cursor, onCursorChange }) => {
  // console.log(`RecordEditor active tab: ${tabID}`);
  if (!MonacoEditor) {
    return <div>Loading...</div>;
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
        cursor={cursor}
        cursorChange={onCursorChange}
      />
    </div>
  );
};

export default Editor;
