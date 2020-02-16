import { myFakeJson } from "../../fake_data";
import Play from "../../components/Play";

const PlayUuid = ({ gistID, files }) => {
  return <Play gistID={gistID} files={files} />;
};

PlayUuid.getInitialProps = async ctx => {
  let query = ctx.query.id;
  try {
    // let url = `https://api.github.com/gists/${query}?client_id=${client_id}&client_secret=${client_secret}`;
    // const res = await fetch(url);
    // let json = await res.json();
    // let gistFiles = json.files;

    // let gists = Object.keys(gistFiles).map(key => gistFiles[key]);
    let files = myFakeJson;
    return { gistID: query, files: files };
  } catch (error) {
    console.error(error);
    return {
      gistID: null,
      files: null
    };
  }
};

export default PlayUuid;
