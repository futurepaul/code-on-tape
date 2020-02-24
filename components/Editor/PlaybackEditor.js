import dynamic from "next/dynamic";

let MonacoEditor = null;

if (process.browser && !MonacoEditor) {
  MonacoEditor = dynamic(() => import("../../components/Editor/EditorRaw"), {
    ssr: false
  });
}

const PlaybackEditor = ({ gist, tabID, cursor }) => {
  //
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
        cursor={cursor}
      />
    </div>
  );
};

export default PlaybackEditor;
