import React from "react";
import Editor from "../../components/Editor";
import Controls from "../../components/Controls";
import { useRouter } from "next/router";
import { myFakeJson } from "../../fake_data";

const Record = ({ gistID, gists }) => {
  if (gists != null) {
    return (
      <div>
        <Controls />
        <Editor gistID={gistID} gists={gists} />
      </div>
    );
  } else {
    return "Didn't get good gists bro";
  }
};

const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID;
const client_secret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
// const query = "7c09ce3491dcfb9ca103bc46127435d4";

Record.getInitialProps = async ctx => {
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

export default Record;
