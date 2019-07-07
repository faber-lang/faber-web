import React from 'react';
import MonacoEditor from 'react-monaco-editor';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Columns } from 'react-bulma-components';

// const ENDPOINT_BASE = "https://api.faber.coord-e.com/";
const ENDPOINT_BASE = "http://localhost:8080/";

const endpoint = (name) => ENDPOINT_BASE + name;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
      stdout: '',
      stderr: '',
    };
  }

  editorDidMount = (editor, monaco) => {
    editor.focus();
  }

  onRun = async () => {
    const model = this.refs.monaco.editor.getModel();
    const value = model.getValue();

    const data = {
      code: value,
      tag: "edge",
      save: false,
    };

    const resp = await fetch(
      endpoint("compile"), {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow",
        body: JSON.stringify(data),
    });
    const content = await resp.json();

    this.setState({
      stdout: content.stdout,
      stderr: content.stderr,
    })
  }

  render() {
    return (
      <Columns>
        <Columns.Column>
        <MonacoEditor
            width="100%"
            height="100vh"
            theme="vs-dark"
            value={this.state.code}
            options={{}}
            editorDidMount={this.editorDidMount}
            ref="monaco"
        />
        </Columns.Column>
        <Columns.Column>
            <div id="toolbox">
                <Button onClick={this.onRun}>Run</Button>
            </div>
            <div id="stdout">{this.state.stdout}</div>
            <div id="stderr">{this.state.stderr}</div>
        </Columns.Column>
    </Columns>
    );
  }
}

export default App;
