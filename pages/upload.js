import { useContext, useState } from "react";
import EditorContext from "../context/editor/editorContext";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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
  const { gists, gistID, events } = editorContext;

  // Upload state
  const [success, setSuccess] = useState(false);
  const [url, setUrl] = useState("");
  // const [uploadInput, setUploadInput] = useState({});
  const [hover, setHovering] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0.0);

  // Generate Uuid
  const uuid = uuidv4();

  const handleUpload = ev => {
    // let file = uploadInput[0];
    let events_json = JSON.stringify(events);
    console.log(events_json);
    // Split the filename to get the name and type
    // let fileParts = uploadInput[0].name.split(".");
    // let fileName = fileParts[0];
    // let fileType = fileParts[1];
    let events_file_name = `${uuid}_events.json`;
    let events_file_type = "application/json";
    console.log("Preparing the upload");
    axios
      .post("./api/upload", {
        fileName: events_file_name,
        fileType: events_file_type
      })
      .then(response => {
        console.log(response);
        var returnData = response.data.data.returnData;
        var signedRequest = returnData.signedRequest;
        var url = returnData.url;
        setUrl(url);
        console.log("Recieved a signed request " + signedRequest);

        // Put the fileType in the headers for the upload

        axios
          .put(signedRequest, events_json, {
            onUploadProgress: progressEvent => {
              const { loaded, total } = progressEvent;
              setUploadPercent(Math.round((loaded * 100.0) / total));
            },
            headers: {
              "Content-Type": events_file_type,
              "x-amz-acl": "public-read"
            }
          })
          .then(result => {
            console.log("Response from s3");
            setSuccess(true);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  };

  if (!gists || gists.length == 0) {
    console.log(gists);
    return <div>Not sure how you got here, but I hope everything's okay!</div>;
  } else {
    return (
      <div>
        <button onClick={handleUpload}>Upload!</button>
        <ProgressBar progress={uploadPercent} />
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
