import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import PropTypes from "prop-types";
import React from "react";
// import { noop, processSize } from "./utils";

const noop = () => {};

class MonacoEditor extends React.Component {
  constructor(props) {
    super(props);
    this.containerElement = undefined;
  }

  componentDidMount() {
    this.initMonaco();
  }

  componentDidUpdate(prevProps) {
    const { value, language, theme, height, options, width } = this.props;

    const { editor } = this;
    const model = editor.getModel();

    if (this.props.value != null && this.props.value !== model.getValue()) {
      this.__prevent_trigger_change_event = true;
      this.editor.pushUndoStop();
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value
          }
        ]
      );
      this.editor.pushUndoStop();
      this.__prevent_trigger_change_event = false;
    }
    if (prevProps.language !== language) {
      monaco.editor.setModelLanguage(model, language);
    }
    if (prevProps.theme !== theme) {
      monaco.editor.setTheme(theme);
    }
    if (editor && (width !== prevProps.width || height !== prevProps.height)) {
      editor.layout();
    }
    if (prevProps.options !== options) {
      editor.updateOptions(options);
    }
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }

  assignRef = component => {
    this.containerElement = component;
  };

  destroyMonaco() {
    if (this.editor) {
      this.editor.dispose();
      const model = this.editor.getModel();
      if (model) {
        model.dispose();
      }
    }
    if (this._subscription) {
      this._subscription.dispose();
    }
  }

  initMonaco() {
    const value =
      this.props.value != null ? this.props.value : this.props.defaultValue;
    const { language, theme, options, overrideServices } = this.props;
    if (this.containerElement) {
      // Before initializing monaco editor
      Object.assign(options, this.editorWillMount());
      this.editor = monaco.editor.create(
        this.containerElement,
        {
          value,
          language,
          ...options,
          ...(theme ? { theme } : {})
        },
        overrideServices
      );
      // After initializing monaco editor
      this.editorDidMount(this.editor);
    }
  }

  editorWillMount() {
    const { editorWillMount } = this.props;
    const options = editorWillMount(monaco);
    return options || {};
  }

  editorDidMount(editor) {
    this.props.editorDidMount(editor, monaco);

    this._subscription = editor.onDidChangeModelContent(event => {
      if (!this.__prevent_trigger_change_event) {
        this.props.onChange(editor.getValue(), event);
      }
    });
  }

  render() {
    const { width, height } = this.props;
    // const fixedWidth = processSize(width);
    // const fixedHeight = processSize(height);
    const style = {
      width: "100vw",
      height: "100vh"
    };

    return (
      <div
        ref={this.assignRef}
        style={style}
        className="react-monaco-editor-container"
      />
    );
  }
}

MonacoEditor.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  language: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.object,
  overrideServices: PropTypes.object,
  editorDidMount: PropTypes.func,
  editorWillMount: PropTypes.func,
  onChange: PropTypes.func
};

MonacoEditor.defaultProps = {
  width: "100%",
  height: "100%",
  value: null,
  defaultValue: "",
  language: "javascript",
  theme: null,
  options: {},
  overrideServices: {},
  editorDidMount: noop,
  editorWillMount: noop,
  onChange: noop
};

export default MonacoEditor;

// import * as React from "react";
// import * as monaco from "monaco-editor";

// // (self as any).MonacoEnvironment = {
// //   getWorkerUrl: function(moduleId: string, label: string) {
// //     console.log("loading", moduleId, label);
// //     if (label === "json") {
// //       return "./json.worker.bundle.js";
// //     }
// //     if (label === "css") {
// //       return "./css.worker.bundle.js";
// //     }
// //     if (label === "html") {
// //       return "./html.worker.bundle.js";
// //     }
// //     if (label === "typescript" || label === "javascript") {
// //       return "./ts.worker.bundle.js";
// //     }
// //     return "./editor.worker.bundle.js";
// //   }
// // };

// interface Props {
//   onEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void;
// }

// export class EditorRaw extends React.Component<Props, {}> {
//   private editor!: monaco.editor.IStandaloneCodeEditor;

//   componentDidMount() {
//     console.info("editor mounted");

//     this.editor = monaco.editor.create(
//       document.getElementById("monacoEditor")!,
//       {
//         value: "hello",
//         language: "javascript",
//         minimap: { enabled: false },
//         theme: "vs-dark",
//         fontSize: 16,
//         readOnly: true
//       }
//     );

//     //not sure what this is for?
//     this.editor.getModel()!.setEOL(monaco.editor.EndOfLineSequence.LF);

//     (window as any).addEventListener("resize", () => this.editor.layout());

//     this.props.onEditor(this.editor);
//   }

//   render() {
//     return <div id="monacoEditor"></div>;
//   }
// }
