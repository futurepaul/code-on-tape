import fetch from "isomorphic-unfetch";
import Play from "../../components/Play";

const PlayUuid = ({ gistID, files, audioURL, events }) => {
  if (!files || files.length == 0) {
    return <div>Not sure how you got here, but I hope everything's okay!</div>;
  } else {
    return (
      <div>
        <Play
          gistID={gistID}
          files={files}
          eventLog={events}
          audio={audioURL}
        />
      </div>
    );
  }
};

PlayUuid.getInitialProps = async ctx => {
  let query = ctx.query.id;
  try {
    let url = `https://code-on-tape.sfo2.digitaloceanspaces.com/${query}`;

    const filesResponse = await fetch(`${url}/gist.json`);
    let files = await filesResponse.json();

    const eventsResponse = await fetch(`${url}/events.json`);
    let events = await eventsResponse.json();

    let audioURL = `${url}/audio.ogg`;

    return {
      gistID: files.gistID,
      files: files.gists,
      events: events,
      audioURL: audioURL
    };
  } catch (error) {
    console.error(error);
    return {
      gistID: null,
      files: null,
      events: null,
      audioURL: null
    };
  }
};

export default PlayUuid;
