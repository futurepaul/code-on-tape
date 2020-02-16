import React from "react";
import Editor from "../components/Editor";
import Controls from "../components/Controls";

const Record = ({ gists }) => {
  console.log(gists);
  return (
    <div>
      <Controls />
      <Editor />
    </div>
  );
};

const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID;
const client_secret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
const query = "7c09ce3491dcfb9ca103bc46127435d4";

Record.getInitialProps = async ctx => {
  try {
    let url = `https://api.github.com/gists/${query}?client_id=${client_id}&client_secret=${client_secret}`;
    const res = await fetch(url);
    console.log(res);
    let json = await res.json();
    let gistFiles = json.files;

    let gists = Object.keys(gistFiles).map(key => gistFiles[key]);
    return { gists: gists };
  } catch (error) {
    console.error(error);
    return {
      data: {}
    };
  }
};

export default Record;
