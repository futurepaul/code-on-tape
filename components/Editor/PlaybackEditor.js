import dynamic from "next/dynamic";

let MonacoEditor = null;

if (process.browser && !MonacoEditor) {
  MonacoEditor = dynamic(() => import("../../components/Editor/EditorRaw"), {
    ssr: false
  });
}

const PlaybackEditor = ({ gist, tabID, cursor }) => {
  if (!MonacoEditor) {
    return <div></div>;
  }

  return (
    <div>
      <MonacoEditor
        language="javascript"
        theme="vs-light"
        value={gist[tabID].content}
        cursor={cursor}
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
          readOnly: true
        }}
        editorDidMount={e => console.log(e)}
      />
    </div>
  );
};

export default PlaybackEditor;
