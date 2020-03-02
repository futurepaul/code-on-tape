import fetch from "isomorphic-unfetch";
import WarningBanner from "../../components/WarningBanner";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Play from "../../components/Play";

const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("is anyone going to try to do anything?");

  async function fetchData() {
    let url = `https://code-on-tape.sfo2.digitaloceanspaces.com/0720e143-66eb-4d7d-a95e-47da779f45fb`;

    const filesResponse = await fetch(`${url}/gist.json`);
    let files = await filesResponse.json();

    const eventsResponse = await fetch(`${url}/events.json`);
    let events = await eventsResponse.json();

    let audioURL = `${url}/audio.mp3`;

    setData({
      gistID: files.gistID,
      files: files.gists,
      audioURL: audioURL,
      events: events
    });
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { loading, data };
};

const PlayUuid = () => {
  const { loading, data } = useFetch();

  if (!loading && (!data || !data.files || data.files.length == 0)) {
    return (
      <div>
        <WarningBanner>
          Playback error. That recording couldn't be found.
        </WarningBanner>
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div className="loading"></div>
      ) : (
        <Play
          gistID={data.gistID}
          files={data.files}
          eventLog={data.events}
          audio={data.audioURL}
        />
      )}
    </div>
  );
};

// PlayUuid.getInitialProps = async ctx => {
//   let query = ctx.query.id;
//   try {
//     let url = `https://code-on-tape.sfo2.digitaloceanspaces.com/${query}`;

//     const filesResponse = await fetch(`${url}/gist.json`);
//     let files = await filesResponse.json();

//     const eventsResponse = await fetch(`${url}/events.json`);
//     let events = await eventsResponse.json();

//     // let audioURL = `${url}/audio.ogg`;
//     let audioURL = `${url}/audio.mp3`;

//     console.log(`${files.gists.length}`);

//     console.log(url);

//     return {
//       gistID: files.gistID,
//       files: files.gists,
//       audioURL: audioURL,
//       events: events
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       gistID: null,
//       files: null,
//       audioURL: null,
//       events: null
//     };
//   }
// };

export default PlayUuid;
