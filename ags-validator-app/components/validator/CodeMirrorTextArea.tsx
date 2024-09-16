import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from 'codemirror';
import { EditorView, Decoration } from '@codemirror/view';
import { EditorState, RangeSetBuilder } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark'; // Optional dark theme

interface CodeMirrorTextAreaProps {
  agsData: string;
  setAgsData: React.Dispatch<React.SetStateAction<string>>;
  highlightLineNumbers?: number[]; // Array of line numbers to highlight (1-based)
}

const CodeMirrorTextArea: React.FC<CodeMirrorTextAreaProps> = ({
  agsData,
  setAgsData,
  highlightLineNumbers = [],
}) => {
  // Function to handle line highlighting using CodeMirror decorations
  const highlightLines = (state: EditorState) => {
    const builder = new RangeSetBuilder<Decoration>();

    highlightLineNumbers.forEach(lineNumber => {
      const line = state.doc.line(lineNumber); // Get the line object by line number (1-based index)

      // Create a decoration to highlight the line
      const highlightDeco = Decoration.line({
        attributes: { style: 'background-color: rgba(255, 0, 0, 0.2);' }, // Red highlight with opacity
      });

      builder.add(line.from, line.from, highlightDeco); // Apply the decoration to the start of the line
    });

    return builder.finish();
  };

  // Create an extension that adds decorations based on the lines to highlight
  const lineHighlighter = EditorView.decorations.compute([], (state) => highlightLines(state));

  const handleEditorChange = (value: string) => {
    // Update the state with the new value
    setAgsData(value);
  };

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <CodeMirror
        value={agsData}
        height="100%" // Set height to fill the parent container
        width="100%" // Set width to fill the parent container
        extensions={[
          basicSetup,
          lineHighlighter, // Extension to highlight the specific line
        //   EditorView.lineWrapping, // Enable word wrapping
          oneDark, // Optional: You can replace this with any other theme
        ]}
        style={{width: "100vh", height: "81.8vh"}}
        theme="light" // or "dark" depending on your preference
        onChange={handleEditorChange} // Handle input changes
      />
    </div>
  );
};

export default CodeMirrorTextArea;
