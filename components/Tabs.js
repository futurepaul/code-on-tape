import { useState } from "react";

const Tab = ({ onClick, active, children }) => {
  return (
    <>
      <button className={active && "active"} onClick={onClick}>
        {children}
      </button>
      <style jsx>{`
        button {
          font-size: 1rem;
          padding: 0.25rem 1rem;
          margin-right: 2px;
          border-top: 2px solid black;
          border-left: 2px solid black;
          border-right: 2px solid black;
          border-bottom: none;
          background: white;
          color: black;
        }
        .active {
          background: black;
          color: white;
        }
      `}</style>
    </>
  );
};

const Tabs = ({ files, activeTab, setActiveTab }) => {
  return (
    <>
      <div className="nav">
        {files.map((file, index) => (
          <Tab
            active={index === activeTab}
            onClick={() => setActiveTab(index)}
            key={index}
          >
            {files[index].filename}
          </Tab>
        ))}
      </div>

      <style jsx>{`
        .nav {
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;
          border-bottom: 2px solid black;
          padding-left: 1rem;
        }
      `}</style>
    </>
  );
};

export default Tabs;
