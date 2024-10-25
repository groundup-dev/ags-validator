import React, { useEffect, useMemo, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { classname } from "@uiw/codemirror-extensions-classname";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { AgsError } from "@groundup/ags";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { applySetRawDataEffect, setRawData } from "@/lib/redux/ags";

type CodeMirrorTextAreaProps = {
  setGoToErrorCallback: (callback: (error: AgsError) => void) => void;
};

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
    backgroundColor: "var(--destructive-foreground)",
    color: "black",
  },
  "& .hover-line": {
    // Add a style for hovered line
    backgroundColor: "#FFF372 !important",
  },
  "& .cm-scroller": {
    borderRadius: "6px",
  },
});

const CodeMirrorTextArea: React.FC<CodeMirrorTextAreaProps> = ({
  setGoToErrorCallback,
}) => {
  const agsData = useAppSelector((state) => state.ags.rawData);

  const errors = useAppSelector((state) => state.ags.errors);

  const dispatch = useAppDispatch();

  const errorLines = errors?.map((error) => error.lineNumber);

  const editorRef = useRef<EditorView | null>(null);

  const handleEditorChange = (value: string) => {
    dispatch(setRawData(value));
    dispatch(applySetRawDataEffect());
  };

  useEffect(() => {
    setGoToErrorCallback(() => goToErrorInText);
  }, [setGoToErrorCallback]);

  const goToErrorInText = (error: AgsError) => {
    if (editorRef.current) {
      editorRef.current.focus();
      editorRef.current.dispatch({
        selection: {
          anchor: editorRef.current.state.doc.line(error.lineNumber).from,
          head: editorRef.current.state.doc.line(error.lineNumber).to,
        },
        scrollIntoView: true,
      });
    }
  };

  const classNameExt = useMemo(
    () =>
      classname({
        add: (lineNumber) => {
          if (errorLines.includes(lineNumber)) {
            return "error-line"; // Highlight error lines
          }
          return undefined;
        },
      }),
    [errorLines]
  );

  return (
    <div className="h-full w-full flex flex-col overflow-auto">
      <CodeMirror
        value={agsData} // Use agsData and fallback to default content if empty
        placeholder={"Paste data here, or upload an AGS file..."}
        extensions={[basicSetup, themeDemo, classNameExt]} // Use dynamic classnameExt
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
