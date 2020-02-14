import { myFakeJson } from "../../fake_data";
import Editor from "../../components/Editor/Editor";

const Play = ({ gistID, gists }) => {
  return (
    <Editor value={gists[0].content} cursor={{ lineNumber: 5, column: 0 }} />
  );
};

Play.getInitialProps = async ctx => {
  let query = ctx.query.id;
  try {
    // let url = `https://api.github.com/gists/${query}?client_id=${client_id}&client_secret=${client_secret}`;
    // const res = await fetch(url);
    // let json = await res.json();
    // let gistFiles = json.files;

    // let gists = Object.keys(gistFiles).map(key => gistFiles[key]);
    let gists = myFakeJson;
    return { gistID: query, gists: gists };
  } catch (error) {
    console.error(error);
    return {
      gistID: null,
      gists: null
    };
  }
};

export default Play;
