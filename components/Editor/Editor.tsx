import * as React from "react";
import * as monaco from "monaco-editor";
import { EditorRaw } from "./EditorRaw";
type IPosition = monaco.IPosition;

interface Props {
  value: string;
  cursor: monaco.IPosition;
  onEditorCursorMove(position: IPosition): void;
}

interface State {
  editor?: monaco.editor.IStandaloneCodeEditor;
}

class Editor extends React.Component<Props, State> {
  state: State = {
    editor: undefined
  };

  private onEditor = (editor: monaco.editor.IStandaloneCodeEditor) => {
    console.log("on editor");

    editor.setValue(this.props.value);

    editor.onDidChangeModelContent(event => {
      // console.log("editor changes", event.changes);
    });

    editor.onDidChangeCursorPosition(event => {
      // console.info(`cursor position changed ${event.position}`);
      this.props.onEditorCursorMove(event.position);
    });

    this.setState({ editor });
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.value !== prevProps.value) {
      this.state.editor.setValue(this.props.value);
    }

    if (this.props.cursor !== prevProps.cursor) {
      this.state.editor.focus();
      this.state.editor.setPosition(this.props.cursor);
    }
  }

  render() {
    return <EditorRaw onEditor={this.onEditor} />;
  }
}

export default Editor;
