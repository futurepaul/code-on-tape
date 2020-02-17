import { useContext } from "react";
import EditorContext from "../../context/editor/editorContext";

import Play from "../../components/Play";
import WarningBanner from "../../components/WarningBanner";
import Link from "next/link";

const PlayWithState = () => {
  const editorContext = useContext(EditorContext);
  const { audioURL, gists, gistID, events } = editorContext;

  if (!gists || gists.length == 0) {
    console.log(gists);
    return <div>Not sure how you got here, but I hope everything's okay!</div>;
  } else {
    return (
      <div>
        <WarningBanner>
          Here's an <em>(unsaved!)</em> preview of your recording.
          <Link href="/upload">
            <button>Save and share</button>
          </Link>
          <style jsx>
            {`
              em {
                font-style: normal;
                text-decoration: underline;
              }

              button {
                background-color: white;
                border: 1px solid black;
                margin-left: 1em;
              }
            `}
          </style>
        </WarningBanner>
        <Play
          gistID={gistID}
          files={gists}
          eventLog={events}
          audio={audioURL}
        />
      </div>
    );
  }
};

export default PlayWithState;
