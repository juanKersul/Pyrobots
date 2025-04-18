import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

function IdeEditor({ code, onCodeChange }) {
  const handleInternalChange = React.useCallback((value, viewUpdate) => {
    onCodeChange(value);
  }, [onCodeChange]);

  return (
    <div>
      <h2>Editor de Robot</h2>
      <CodeMirror
        value={code}
        height="400px"
        extensions={[python()]}
        onChange={handleInternalChange}
        theme="dark"
      />
    </div>
  );
}

export default IdeEditor;