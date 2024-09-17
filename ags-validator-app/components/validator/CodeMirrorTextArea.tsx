import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { classname } from '@uiw/codemirror-extensions-classname';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';

interface CodeMirrorTextAreaProps {
  agsData: string;
  setAgsData: React.Dispatch<React.SetStateAction<string>>;
  errorLines: number[]; 
}

const themeDemo = EditorView.baseTheme({
  '&dark .error-line': { backgroundColor: 'rgba(255, 0, 0, 0.2)' },
  '&light .error-line': { backgroundColor: 'rgba(255, 0, 0, 0.2)' },
  '& .cm-activeLine': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    color: 'black',
  },
  '& .cm-Line': {
    color: 'black',
  },
  '& .cm-activeLine.error-line': {
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
    color: 'black',
  },
});

const CodeMirrorTextArea: React.FC<CodeMirrorTextAreaProps> = ({
  agsData,
  setAgsData,
  errorLines,
}) => {
  const classnameExt = classname({
    add: (lineNumber) => {
      if (errorLines.includes(lineNumber)) {
        return 'error-line';
      }
      return undefined;
    },
  });

  const handleEditorChange = (value: string) => {
    setAgsData(value);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <CodeMirror
        value={agsData}
        extensions={[basicSetup, classnameExt, themeDemo]}
        height="100%"
        width="100%"
        onChange={handleEditorChange}
        className="w-full h-[81.8vh] rounded-md"
      />
    </div>
  );
};

export default CodeMirrorTextArea;
