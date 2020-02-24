import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

function parseGist(input) {
  return input.substring(input.lastIndexOf("/") + 1, input.length);
}

const Intro = () => {
  const router = useRouter();
  const [gist, setGist] = useState("");

  const getGist = e => {
    e.preventDefault();
    let parsedGist = parseGist(gist);
    router.push("/record/[id]", `/record/${parsedGist}`);
  };

  return (
    <>
      <div className="center-wrap">
        <div className="intro">
          <h2>Code on tape</h2>
          <p>Record audio documentation for code.</p>
          <p>
            Import a <a href="http://gist.github.com">gist</a> to get started.
          </p>
          <form onSubmit={getGist}>
            <input
              value={gist}
              onChange={e => {
                setGist(e.target.value);
              }}
              placeholder="gist ID or URL"
            ></input>
            <button>Get gist</button>
          </form>
          <p>
            (I usually use{" "}
            <a href="https://gist.github.com/futurepaul/f1cf2fce2af511b649afac5f3b21e9f5">
              this gist
            </a>{" "}
            for testing.)
          </p>
        </div>
      </div>
      <style jsx>{`
        h2 {
          text-shadow: 2px 2px #00ffff;
        }

        button,
        input {
          display: inline-block;
          padding: 10px 10px;
          border-radius: 0;
        }

        input {
          margin: 0;
          border: solid 1px black;
        }

        button {
          border: solid 1px black;
          background-color: #00ffff;
          margin-left: -1px;
        }

        .intro {
          background-color: white;
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
    </>
  );
};

export default Intro;
