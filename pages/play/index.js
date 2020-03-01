import { useContext, useEffect } from "react";
import EditorContext from "../../context/editor/editorContext";

import Play from "../../components/Play";
import WarningBanner from "../../components/WarningBanner";
import Link from "next/link";

const PlayWithState = () => {
  const editorContext = useContext(EditorContext);
  const { audioURL, gists, gistID, events } = editorContext;

  useEffect(() => {
    window.addEventListener("beforeunload", e => {
      e.preventDefault();
      var confirmationMessage =
        "If you leave this page without uploading your recording will be lost!";
      return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    });
  });

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
    <div>
      <WarningBanner>
        Here's an <em>(unsaved!)</em> preview of your recording.
        <Link href="/upload">
          <button>Save and share</button>
        </Link>
      </WarningBanner>
      <Play gistID={gistID} files={gists} eventLog={events} audio={audioURL} />
    </div>
  );
};

export default PlayWithState;
