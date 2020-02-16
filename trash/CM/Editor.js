// import React, { useEffect, useRef, useContext } from "react";
// import CodeMirror from "codemirror";

// import "codemirror/mode/javascript/javascript";
// import "codemirror/lib/codemirror.css";
// import "codemirror/addon/edit/closebrackets";
// import "codemirror/addon/edit/matchbrackets";
// import "codemirror/theme/monokai.css";
// import "codemirror/theme/neo.css";

// const RawView = props => {
//   const editorRef = useRef(null);
//   const editor = useRef();
//   // const theme = useContext(ThemeContext);

//   useEffect(() => {
//     editor.current = CodeMirror(editorRef.current, {
//       matchBrackets: true,
//       autoCloseBrackets: true,
//       mode: "application/json",
//       lineWrapping: true,
//       lineNumbers: true,
//       theme: "neo",
//       readOnly: true
//     });
//   }, []);

//   // useEffect(() => {
//   //   if (editor.current) {
//   //     editor.current.setOption("theme", codeMirrorTheme[theme]);
//   //   }
//   // }, [theme]);

//   useEffect(() => {
//     editor.current.setValue(props.value);
//   }, [props]);

//   return (
//     <>
//       <div className="cmwrap" ref={editorRef} />
//       <style jsx>{`
//         .cmwrap {
//           flex: 1;
//           overflow: auto;
//           font-size: 1.2rem;
//           height: 100%;
//         }
//         .CodeMirror {
//           background-color: red;
//         }
//       `}</style>
//     </>
//   );
// };

// export default RawView;

import React, { options, useEffect, useRef } from "react";
import codemirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/theme/monokai.css";
import "codemirror/theme/neo.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/css/css"; // Side effect
import "codemirror/theme/neo.css";
import PropTypes from "prop-types";
const CodemirrorWrap = ({ value, onChange }) => {
  const textArea = useRef(null);
  const editor = useRef(null);
  useEffect(() => {
    editor.current = codemirror.fromTextArea(textArea.current, options);
    editor.current.on("change", doc => onChange(doc.getValue()));
    return () => {
      if (editor.current) {
        editor.current.toTextArea();
      }
    };
  }, [onChange]);
  return (
    <textarea
      ref={textArea}
      name="name"
      defaultValue={value}
      autoComplete="off"
    />
  );
};
CodemirrorWrap.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.shape({
    lineNumbers: PropTypes.bool,
    tabMode: PropTypes.string,
    matchBrackets: PropTypes.bool,
    theme: PropTypes.string,
    mode: PropTypes.string
  })
};
CodemirrorWrap.defaultProps = {
  options: {
    lineNumbers: true,
    tabMode: "indent",
    matchBrackets: true,
    theme: "neo",
    mode: "javascript"
  }
};
export default CodemirrorWrap;
