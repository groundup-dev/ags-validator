import React, { useEffect, useMemo, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { classname } from "@uiw/codemirror-extensions-classname";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { AgsError } from "@groundup/ags";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { applySetRawDataEffect, setRawData } from "@/lib/redux/ags";
import { useTheme } from "next-themes";

type CodeMirrorTextAreaProps = {
  setGoToErrorCallback: (callback: (error: AgsError) => void) => void;
};

const CodeMirrorTextArea: React.FC<CodeMirrorTextAreaProps> = ({
  setGoToErrorCallback,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
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

  const themeDemo = EditorView.baseTheme({
        "&": {
          backgroundColor: "transparent",
        },
        ".cm-content": {
          caretColor: "hsl(var(--foreground))",
          color: "hsl(var(--foreground))",
        },
        ".cm-cursor": {
          borderLeftColor: "hsl(var(--foreground))",
        },
        ".cm-selectionBackground, .cm-content ::selection": {
          backgroundColor: "hsl(var(--muted) / 0.3)",
        },
        ".error-line": {
          backgroundColor: "hsl(var(--destructive) / 0.15)",
        },
        ".cm-activeLine": {
          backgroundColor: "hsl(var(--muted) / 0.1)",
        },
        ".cm-line": {
          color: "hsl(var(--foreground))",
        },
        ".cm-activeLine.error-line": {
          backgroundColor: "hsl(var(--destructive) / 0.25)",
        },
        ".hover-line": {
          backgroundColor: "hsl(var(--warning) / 0.15) !important",
        },
        ".cm-scroller": {
          fontFamily: "monospace",
          borderRadius: "var(--radius)",
          border: "1px solid hsl(var(--border))",
          padding: "0.5rem",
        },
        ".cm-gutters": {
          backgroundColor: "hsl(var(--secondary))",
          color: "hsl(var(--secondary-foreground))",
          border: "none",
          borderTopLeftRadius: "var(--radius)",
          borderBottomLeftRadius: "var(--radius)",
        },
        ".cm-gutter": {
          backgroundColor: "transparent",
          color: "hsl(var(--muted-foreground))",
        },
        ".cm-activeLineGutter": {
          backgroundColor: "hsl(var(--muted) / 0.1)",
        },
        ".cm-lineNumbers": {
          color: "hsl(var(--muted-foreground))",
        },
        ".cm-placeholder": {
          color: "hsl(var(--muted-foreground))",
        },
        // Syntax highlighting
        ".cm-keyword": { color: "hsl(var(--primary))" },
        ".cm-property": { color: "hsl(var(--alternative))" },
        ".cm-string": { color: "hsl(var(--success))" },
        ".cm-number": { color: "hsl(var(--warning))" },
        ".cm-comment": { color: "hsl(var(--muted-foreground))" },
      });

  return (
    <div className="h-full w-full flex flex-col overflow-auto">
      <CodeMirror
        value={agsData}
        placeholder={"Paste data here, or upload an AGS file..."}
        extensions={[basicSetup, themeDemo, classNameExt]}
        height="100%"
        width="100%"
        onChange={handleEditorChange}
        className="w-full h-full rounded-md"
        theme={isDark ? "dark" : "light"}
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
