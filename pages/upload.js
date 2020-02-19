import { useContext, useState } from "react";
import EditorContext from "../context/editor/editorContext";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function fileUpload(
  fileName,
  fileType,
  file,
  onUploadPercent,
  onSuccess,
  setUrl
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
        });
    })
    .catch(error => {
      console.error(error);
    });
}

const ProgressBar = ({ progress }) => (
  <div>
    <style jsx>{`
      .background {
        background-color: pink;
      }
      .foreground {
        background-color: red;
        width: ${progress}%;
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
  // const [uploadInput, setUploadInput] = useState({});
  const [hover, setHovering] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0.0);
  const [urls, setUrls] = useState({ events: null, audio: null });
  const [eventsUrl, setEventsUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  // Generate Uuid
  const uuid = uuidv4();

  const handleUpload = ev => {
    //Upload the json
    let events_json = JSON.stringify(events);
    let events_file_name = `${uuid}/events.json`;
    let events_file_type = "application/json";
    fileUpload(
      events_file_name,
      events_file_type,
      events_json,
      setUploadPercent,
      setSuccess,
      setEventsUrl
    );

    //Upload the mp3
    let audio_file_name = `${uuid}/audio.ogg`;
    let audio_file_type = "audio/ogg";
    let audio_url = fileUpload(
      audio_file_name,
      audio_file_type,
      audioBlob,
      setUploadPercent,
      setSuccess,
      setAudioUrl
    );
  };

  if (!gists || gists.length == 0) {
    console.log(gists);
    return <div>Not sure how you got here, but I hope everything's okay!</div>;
  } else {
    return (
      <div>
        <button onClick={handleUpload}>Upload!</button>
        <ProgressBar progress={uploadPercent} />
        <div>
          <p>{eventsUrl && <a href={eventsUrl}>events</a>}</p>
          <p>{audioUrl && <a href={audioUrl}>audio</a>}</p>
        </div>
        <ul>
          {events.map((e, i) => {
            let cursor = e.cursor;
            return (
              <li
                key={i}
              >{`line: ${cursor.lineNumber}, column: ${cursor.column}, tab: ${e.tab} time: ${e.time}`}</li>
            );
          })}
        </ul>
      </div>
    );
  }
};

export default Upload;
