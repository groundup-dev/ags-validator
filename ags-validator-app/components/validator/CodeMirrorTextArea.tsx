import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { classname } from "@uiw/codemirror-extensions-classname";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";

interface CodeMirrorTextAreaProps {
  agsData: string;
  setAgsData: React.Dispatch<React.SetStateAction<string>>;
  errorLines: number[];
  activeLineNumber: number | undefined;
  hoverLineNumber: number | null;
}

const themeDemo = EditorView.baseTheme({
  "&dark .error-line": { backgroundColor: "rgba(255, 0, 0, 0.2)" },
  "&light .error-line": { backgroundColor: "rgba(255, 0, 0, 0.2)" },
  "& .cm-activeLine": {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    color: "black",
  },
  "& .cm-Line": {
    color: "black",
  },
  "& .cm-activeLine.error-line": {
    backgroundColor: "rgba(255, 0, 0, 0.4)",
    color: "black",
  },
  "& .hover-line": { // Add a style for hovered line
    backgroundColor: "yellow !important", 
  },
});

const CodeMirrorTextArea: React.FC<CodeMirrorTextAreaProps> = ({
  agsData,
  setAgsData,
  errorLines,
  activeLineNumber,
  hoverLineNumber,
}) => {
  const editorRef = useRef<EditorView | null>(null);
  const [classnameExt, setClassnameExt] = useState(() =>
    classname({
      add: (lineNumber) => {
        if (hoverLineNumber !== null && lineNumber === hoverLineNumber) {
          return "hover-line"; // Highlight the hovered line in yellow
        }
        if (errorLines.includes(lineNumber)) {
          return "error-line"; // Highlight error lines in red
        }
        return undefined;
      },
    })
  );

  // Update the classname extension when hoverLineNumber or errorLines change
  useEffect(() => {
    setClassnameExt(
      classname({
        add: (lineNumber) => {
          if (hoverLineNumber !== null && lineNumber === hoverLineNumber) {
            return "hover-line"; // Highlight the hovered line
          }
          if (errorLines.includes(lineNumber)) {
            return "error-line"; // Highlight error lines
          }
          return undefined;
        },
      })
    );
  }, [hoverLineNumber, errorLines]); // Track both hoverLineNumber and errorLines

  const handleEditorChange = (value: string) => {
    setAgsData(value); // Sync the editor value back to agsData state
  };

  useEffect(() => {
    if (editorRef.current && activeLineNumber !== undefined) {
      const view = editorRef.current;
      const doc = view.state.doc;

      if (activeLineNumber >= 1 && activeLineNumber <= doc.lines) {
        const line = doc.line(activeLineNumber);

        view.dispatch({
          selection: { head: line.from, anchor: line.to },
          scrollIntoView: true,
        });
      } else {
        console.warn(`Invalid line number: ${activeLineNumber}`);
      }
    }
  }, [activeLineNumber]);

  return (
    <div className="h-full w-full flex flex-col overflow-auto">
      <CodeMirror
        value={agsData} // Use agsData and fallback to default content if empty
        extensions={[basicSetup, classnameExt, themeDemo]} // Use dynamic classnameExt
        height="100%"
        width="100%"
        onChange={handleEditorChange} // Handle content change
        className="w-full h-full rounded-md"
        ref={(view) => {
          if (view?.view) {
            editorRef.current = view.view;
          }
        }}
      />
    </div>
  );
};

export default CodeMirrorTextArea;