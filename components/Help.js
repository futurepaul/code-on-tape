import { useState } from "react";

const Help = ({ children }) => {
  const [hover, setHover] = useState(false);

  const onHoverIn = () => {
    setHover(true);
  };

  const onHoverOut = () => {
    setHover(false);
  };

  return (
    <>
      <div>
        <div className="help" onMouseOver={onHoverIn} onMouseOut={onHoverOut}>
          ?
          <div
            className="tooltip"
            style={{ display: hover ? "block" : "none" }}
          >
            {children}
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(em) {
          text-decoration: underline;
          font-style: normal;
        }
        .tooltip {
          color: black;
          background-color: #ffcc00;
          position: absolute;
          right: 2em;
          top: 0;
          z-index: 1;
          width: 10em;
          text-align: left;
          padding: 1em;
        }
        .help {
          border: 1px solid black;
          border-radius: 50%;
          width: 1em;
          height: 1em;
          margin: 0.5em;
          line-height: 1em;
          text-align: center;
        }

        .help:hover {
          color: white;
          background-color: black;
          cursor: help;
        }
      `}</style>
    </>
  );
};

export default Help;
