import React, { useState, useRef, useEffect, FocusEventHandler, FocusEvent } from 'react';
import {
  EditorState,
  RichUtils,
  Editor,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  convertFromHTML,
  ContentState,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import styled from 'styled-components';
import ColorControls from './Colorcontrols';
import { colorStyleMap } from './styles';
import { stateToHTML } from 'draft-js-export-html';

const EditorContainer = styled.div`
  border: 1px solid #ccc;
  min-height: 100px;
  padding: 10px;
  cursor: text;
`;

const Toolbar = styled.div`
  margin-bottom: 10px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  cursor: pointer;
`;

const ColorPicker = styled.input`
  width: 100px;
`;

const TextEditor: React.FC = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showToolbar, setShowToolbar] = useState(false);
  const editorRef = useRef<Editor>(null);
  const [htmlString, setHtmlString] = useState('');

  const onChange = (state: EditorState) => {
    setEditorState(state);
  };

  const handleKeyCommand = (command: string, state: EditorState) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style: string) => {
    onChange(RichUtils.toggleInlineStyle(editorState, style));
  };
  const exportHTML = () => {
    const contentState = editorState.getCurrentContent();
    const options = {
      inlineStyles: {
        red: { element: 'span', style: { color: 'rgba(255, 0, 0, 1.0)' } },
        orange: { element: 'span', style: { color: 'rgba(255, 127, 0, 1.0)' } },
        green: { element: 'span', style: { color: 'rgba(0, 180, 0, 1.0)' } },
        yellow: { element: 'span', style: { color: 'rgba(180, 180, 0, 1.0)' } },
        blue: { element: 'span', style: { color: 'rgba(0, 0, 255, 1.0)' } },
        indigo: { element: 'span', style: { color: 'rgba(75, 0, 130, 1.0)' } },
        violet: { element: 'span', style: { color: 'rgba(127, 0, 255, 1.0)' } },
        // customStyleMap에 정의한 다른 색상을 추가합니다.
      },
    };

    const html = stateToHTML(contentState, options);
    console.log(html); // 여기서 HTML 문자열을 확인하거나 다른 곳으로 보낼 수 있습니다.
  };

  const insertTextAtCursor = (text: string) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    console.log(currentContent);
    console.log(selection);
    const newContent = Modifier.replaceText(currentContent, selection, text);
    const newState = EditorState.push(editorState, newContent, 'insert-characters');
    setEditorState(newState);
  };

  const toggleColor = (color: string) => {
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap).reduce((contentState, color) => {
      return Modifier.removeInlineStyle(contentState, selection, color);
    }, editorState.getCurrentContent());

    console.log(editorState);

    // let nextEditorState = EditorState.push(editorState, nextContentState, 'change-inline-style');
    const newContentState = Modifier.applyInlineStyle(nextContentState, selection, color);
    // console.log(nextEditorState);

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    // if (selection.isCollapsed()) {
    //   nextEditorState = currentStyle.reduce((state, color) => {
    //     return RichUtils.toggleInlineStyle(state as EditorState, color as string);
    //   }, nextEditorState);
    // }
    let nextEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
    // If the color is being toggled on, apply it.
    // if (!currentStyle.has('color')) {
    //   nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, color);
    // }

    setEditorState(nextEditorState);

    // onChange(nextEditorState);
    // const newContentState = Modifier.applyInlineStyle(nextContentState, selection, color);
    // const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
    // console.log(newContentState);
    // setEditorState(newEditorState);

    // onChange(nextEditorState);

    // console.log(color);
    // const selection = editorState.getSelection();
    // console.log(selection);
    // const currentContent = editorState.getCurrentContent();
    // console.log(currentContent);

    // // 기존 색상 스타일을 모두 제거합니다.
    // Modifier.removeInlineStyle(currentContent, selection, color);

    // const nextContentState = Object.keys(customStyleMap).reduce((contentState, color) => {
    //   console.log(contentState, color);
    //   return Modifier.removeInlineStyle(contentState, selection, color);
    // }, currentContent);

    // // 새 색상 스타일을 추가합니다.
    // const newContentState = Modifier.applyInlineStyle(nextContentState, selection, color);

    // const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
    // setEditorState(newEditorState);
  };
  const importHTML = (html: string) => {
    const blocksFromHTML = convertFromHTML(html);
    console.log(blocksFromHTML);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
  };
  return (
    <div>
      <Toolbar>
        <Button onClick={() => toggleInlineStyle('BOLD')}>Bold</Button>
        <Button onClick={() => toggleInlineStyle('ITALIC')}>Italic</Button>
        <Button onClick={() => toggleInlineStyle('UNDERLINE')}>Underline</Button>
        <Button onClick={exportHTML}>Export HTML</Button> {/* HTML 내보내기 버튼 추가 */}
        {/* <ColorPicker
          type="color"
          onClick={() => {
            const currentContent = editorState.getCurrentContent();
            const selection = editorState.getSelection();
            console.log(currentContent);
            console.log(selection);
          }}
          onChange={(e) => toggleColor(e.target.value.toUpperCase())}
        /> */}
        <ColorControls editorState={editorState} onToggle={toggleColor} />
        <Button onClick={() => insertTextAtCursor('Custom Text')}>Insert Text</Button>
      </Toolbar>
      <EditorContainer onClick={() => editorRef.current && editorRef.current.focus()}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={onChange}
          customStyleMap={colorStyleMap}
          ref={editorRef}
        />
      </EditorContainer>{' '}
      <div>
        <textarea
          value={htmlString}
          onChange={(e) => setHtmlString(e.target.value)}
          rows={10}
          cols={50}
        />
        <Button onClick={() => importHTML(htmlString)}>Import HTML</Button>
      </div>
    </div>
  );
};

export default TextEditor;
