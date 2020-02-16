const WarningBanner = props => {
  return (
    <>
      <div className="warning">
        <p>{props.children}</p>
      </div>
      <style jsx>{`
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
      `}</style>
    </>
  );
};

export default WarningBanner;
