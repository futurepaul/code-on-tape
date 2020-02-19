import { myFakeJson } from "../../fake_data";
import Play from "../../components/Play";

const PlayUuid = ({ gistID, files, audioURL, events }) => {
  console.log(events);

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
    // const audioResponse = await fetch(`${url}/audio.ogg`);
    const eventsResponse = await fetch(`${url}/events.json`);

    let audioURL = `${url}/audio.ogg`;
    let events = await eventsResponse.json();

    // console.log(events);

    let files = myFakeJson;

    return {
      gistID: query,
      files: files,
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
