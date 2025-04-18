import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

// Accept code and onCodeChange as props
function IdeEditor({ code, onCodeChange }) {
  // Use the passed onCodeChange prop directly
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
        theme="dark" // O puedes elegir 'light' u otros temas
      />
    </div>
  );
}

export default IdeEditor;