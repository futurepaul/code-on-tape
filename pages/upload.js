import { useContext, useState, useEffect } from "react";
import EditorContext from "../context/editor/editorContext";
import WarningBanner from "../components/WarningBanner";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Layout from "../components/Layout";
import SelfCredit from "../components/SelfCredit";

function fileUpload(
  fileName,
  fileType,
  file,
  onUploadPercent,
  onSuccess,
  setUrl,
  setUploadError
) {
  axios
    .post("./api/upload", {
      fileName,
      fileType
    })
    .then(response => {
      let returnData = response.data.data.returnData;
      let signedRequest = returnData.signedRequest;
      setUrl(returnData.url);

      // Put the fileType in the headers for the upload
      axios
        .put(signedRequest, file, {
          onUploadProgress: progressEvent => {
            const { loaded, total } = progressEvent;
            onUploadPercent(Math.round((loaded * 100.0) / total));
          },
          headers: {
            "Content-Type": fileType,
            "x-amz-acl": "public-read"
          }
        })
        .then(result => {
          onSuccess(true);
        })
        .catch(error => {
          console.error(error);
          setUploadError("nested");
        });
    })
    .catch(error => {
      console.error(error);
      setUploadError("broad");
    });
}

const ProgressBar = ({ progress }) => (
  <div>
    <style jsx>{`
      .background {
        background-color: white;
        border: 1px solid black;
        width: 10em;
        margin-top: 1em;
      }

      .foreground {
        background-color: black;
        width: ${progress}%;
        margin: 1px;
      }
    `}</style>
    <div className="background">
      <div className="foreground">{progress + "%"}</div>
    </div>
  </div>
);

const Upload = () => {
  // Incoming state
  const editorContext = useContext(EditorContext);
  const { gists, gistID, events, audioURL, audioBlob } = editorContext;

  // Upload state
  const [success, setSuccess] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0.0);
  const [eventsUrl, setEventsUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [gistsUrl, setGistsUrl] = useState(null);
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Generate Uuid
  const uuid = uuidv4();

  const handleUpload = ev => {
    //Upload the events json
    let events_json = JSON.stringify(events);
    let events_file_name = `${uuid}/events.json`;
    let events_file_type = "application/json";
    fileUpload(
      events_file_name,
      events_file_type,
      events_json,
      setUploadPercent,
      setSuccess,
      setEventsUrl,
      setUploadError
    );

    //Upload the gists json
    let gists_json = JSON.stringify({ gists, gistID });
    let gists_file_name = `${uuid}/gist.json`;
    let gists_file_type = "application/json";

    fileUpload(
      gists_file_name,
      gists_file_type,
      gists_json,
      setUploadPercent,
      setSuccess,
      setGistsUrl,
      setUploadError
    );

    //Upload the mp3
    // let audio_file_name = `${uuid}/audio.ogg`;
    // let audio_file_type = "audio/ogg";
    let audio_file_name = `${uuid}/audio.mp3`;
    let audio_file_type = "audio/mpeg";
    let audio_url = fileUpload(
      audio_file_name,
      audio_file_type,
      audioBlob,
      setUploadPercent,
      setSuccess,
      setAudioUrl,
      setUploadError
    );

    setPlaybackUrl(`/play/${uuid}`);
  };

  const uploadFailMessage = (
    <WarningBanner>
      Upload error. Sorry! Please{" "}
      <a href="https://github.com/futurepaul/code-on-tape/issues">
        <button>open an issue</button>
      </a>{" "}
      or{" "}
      <a href="https://twitter.com/futurepaul/">
        <button>hit me up on Twitter</button>
      </a>
    </WarningBanner>
  );

  if (!gists || gists.length == 0) {
    return uploadFailMessage;
  }

  return (
    <Layout title="Upload">
      {uploadError && uploadFailMessage}
      <div className="center-wrap">
        <div className="upload">
          {(!eventsUrl || !audioUrl || !gistsUrl || !playbackUrl) && (
            <>
              <button onClick={handleUpload}>Upload!</button>
              <ProgressBar progress={uploadPercent} />
            </>
          )}

          {eventsUrl && audioUrl && gistsUrl && playbackUrl && (
            <p>
              <h2>
                <a href={`${playbackUrl}`}>{`codeontape.com${playbackUrl}`}</a>
              </h2>
            </p>
          )}
          <p></p>
          <SelfCredit />
        </div>
      </div>
      )}
      <style jsx>{`
        button {
          padding: 10px 10px;
          border-radius: 0;
          border: solid 1px black;
          background-color: #00ffff;
        }
        .spacer {
          height: 2em;
        }

        .upload {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 20em;
          height: 20em;
        }

        .center-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
      `}</style>
    </Layout>
  );
};

export default Upload;
