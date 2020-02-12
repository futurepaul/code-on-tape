import React, { useContext, useState } from "react";
import Link from "next/link";

const Intro = () => {
  const [gist, setGist] = useState("");

  return (
    <>
      <div className="intro">
        <h2>Code on tape</h2>
        <p>
          Record audio documentation for code. Import a gist to get started.
        </p>
        <p>Might I suggest:</p> <pre>7c09ce3491dcfb9ca103bc46127435d4</pre>
        <input
          onChange={e => {
            setGist(e.target.value);
          }}
        ></input>
        <Link href="/record/[id]" as={`/record/${gist}`}>
          <button>Get gist</button>
        </Link>
      </div>
      <style jsx>{`
        .intro {
          border: 2px solid rgb(40, 40, 40);
          border-radius: 0.5rem;
          background-color: white;
          width: 30rem;
          margin: 0 auto;
          padding: 1rem;
          box-shadow: rgba(200, 200, 200, 0.5) 1px 1px 0.5rem;
        }
      `}</style>
    </>
  );
};

export default Intro;
