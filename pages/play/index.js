import { useContext, useEffect } from "react";
import EditorContext from "../../context/editor/editorContext";
import Play from "../../components/Play";
import WarningBanner from "../../components/WarningBanner";
import Link from "next/link";
import Layout from "../../components/Layout";

const PlayWithState = () => {
  const editorContext = useContext(EditorContext);
  const { audioURL, gists, gistID, events } = editorContext;

  if (!gists || gists.length == 0) {
    return (
      <div>
        <WarningBanner>
          Playback error. Maybe try recording again?
        </WarningBanner>
      </div>
    );
  }

  return (
    <Layout title="Preview">
      <WarningBanner>
        Here's an <em>(unsaved!)</em> preview of your recording.{" "}
        <Link href="/upload">
          <button>Save and share</button>
        </Link>
      </WarningBanner>
      <Play gistID={gistID} files={gists} eventLog={events} audio={audioURL} />
    </Layout>
  );
};

export default PlayWithState;
