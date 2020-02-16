import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import PropTypes from "prop-types";
import React from "react";

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
    const { value, language, theme, options, cursor } = this.props;

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
    // if (editor && (width !== prevProps.width || height !== prevProps.height)) {
    //   editor.layout();
    // }
    if (prevProps.options !== options) {
      editor.updateOptions(options);
    }

    if (prevProps.cursor && cursor !== prevProps.cursor) {
      this.__prevent_trigger_change_event = true;
      editor.focus();
      editor.setPosition(this.props.cursor);
      editor.revealLineInCenterIfOutsideViewport(this.props.cursor.lineNumber);

      this.__prevent_trigger_change_event = false;
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

    // This is how we'd do if we cared about changes to the value:
    // this._subscription = editor.onDidChangeModelContent(event => {
    //   if (!this.__prevent_trigger_change_event) {
    //     this.props.onChange(editor.getValue(), event);
    //   }
    // });

    this._subscription = editor.onDidChangeCursorPosition(event => {
      // console.info(`cursor position changed ${event.position}`);
      if (!this.__prevent_trigger_change_event && this.props.cursorChange) {
        this.props.cursorChange(event.position);
      }
    });
  }

  render() {
    const style = {
      width: "100%",
      height: "90vh"
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
  value: PropTypes.string,
  cursor: PropTypes.object,
  cursorChange: PropTypes.func,
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
  value: null,
  cursor: null,
  cursorChange: null,
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
