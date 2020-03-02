const WarningBanner = props => {
  return (
    <>
      <div className="warning">
        <p>{props.children}</p>
      </div>
      <style jsx>{`
        :global(em) {
          font-style: normal;
          text-decoration: underline;
        }
        p {
          margin: 0;
        }
        .warning {
          color: white;
          background-color: #ff0080;
          padding: 1em;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
        :global(button) {
          border: solid 1px black;
          background: white;
        }

        :global(button.danger) {
          background: none;
          color: white;
        }
      `}</style>
    </>
  );
};

export default WarningBanner;
