import React, { useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { classname } from '@uiw/codemirror-extensions-classname';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';

interface CodeMirrorTextAreaProps {
  agsData: string;
  setAgsData: React.Dispatch<React.SetStateAction<string>>;
  errorLines: number[];
  activeLineNumber: number | undefined;
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
  activeLineNumber,
}) => {
  const editorRef = useRef<EditorView | null>(null);

  const classnameExt = classname({
    add: (lineNumber) => {
      if (errorLines.includes(lineNumber)) {
        return 'error-line';
      }
      return undefined;
    },
  });

  const handleEditorChange = (value: string) => {
    console.log("value",value.replace(/\\n/g, '\n'))
    const t = value.replace(/\\n/g, '\n')
    console.log(t.toString())
    setAgsData(t); // Sync the editor value back to agsData state
  };

  useEffect(() => {
    if (editorRef.current && activeLineNumber !== undefined) {
      const view = editorRef.current;
      const doc = view.state.doc;

      console.log('Document Content:', doc.toString()); // Output document content
      console.log('Total Lines:', doc.lines); // Check the total lines

      if (activeLineNumber >= 1 && activeLineNumber <= doc.lines) {
        const line = doc.line(activeLineNumber);
        console.log('Line:', line);

        // view.dispatch({
        //   selection: { head: line.from, anchor: line.to },
        //   scrollIntoView: true,
        // });
      } else {
        console.warn(`Invalid line number: ${activeLineNumber}`);
      }
    }
  }, [activeLineNumber]);

  return (
    <div className="h-full w-full flex flex-col overflow-auto">
      <CodeMirror
        value={agsData || "test\ntest2\n"} // Use agsData and fallback to default content if empty
        extensions={[basicSetup, classnameExt, themeDemo]}
        height="100%"
        width="100%"
        onChange={handleEditorChange} // Handle content change
        className="w-full h-full rounded-md"
        ref={(view: EditorView | null) => {
          if (view) {
            editorRef.current = view;
          }
        }}
      />
    </div>
  );
};

export default CodeMirrorTextArea;
