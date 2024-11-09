import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { basicSetup } from "@uiw/codemirror-extensions-basic-setup";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentUnit } from "@codemirror/language";
import { useEffect, useState } from "react";
import { initDocument } from "../../utils/collabSocket";
import { cursorExtension } from "../../utils/collabCursor";
import { yCollab } from "y-codemirror.next";
import { Doc, Text } from "yjs";
import { Awareness } from "y-protocols/awareness";
import { useCollab } from "../../contexts/CollabContext";
import {
  USE_COLLAB_ERROR_MESSAGE,
  USE_MATCH_ERROR_MESSAGE,
} from "../../utils/constants";
import { useMatch } from "../../contexts/MatchContext";

interface CodeEditorProps {
  editorState?: { doc: Doc; text: Text; awareness: Awareness };
  uid?: string;
  username?: string;
  language: string;
  template?: string;
  roomId?: string;
  isReadOnly?: boolean;
}

const languageSupport = {
  Python: langs.python(),
  Java: langs.java(),
  C: langs.c(),
};

const CodeEditor: React.FC<CodeEditorProps> = (props) => {
  const {
    editorState,
    uid = "",
    username = "",
    language,
    template = "",
    roomId = "",
    isReadOnly = false,
  } = props;

  const match = useMatch();
  if (!match) {
    throw new Error(USE_MATCH_ERROR_MESSAGE);
  }

  const { matchCriteria, matchUser, partner, questionId, questionTitle } =
    match;

  const collab = useCollab();
  if (!collab) {
    throw new Error(USE_COLLAB_ERROR_MESSAGE);
  }

  const { setCode, checkDocReady } = collab;

  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState<boolean>(false);

  const onEditorReady = (editor: ReactCodeMirrorRef) => {
    if (!isEditorReady && editor?.editor && editor?.state && editor?.view) {
      setIsEditorReady(true);
    }
  };

  const handleChange = (value: string) => {
    setCode(value);
  };

  useEffect(() => {
    if (isReadOnly || !isEditorReady || !editorState) {
      return;
    }

    const loadTemplate = async () => {
      if (
        matchUser &&
        partner &&
        matchCriteria &&
        questionId &&
        questionTitle
      ) {
        checkDocReady(roomId, editorState.doc, setIsDocumentLoaded);
        await initDocument(
          uid,
          roomId,
          template,
          matchUser.id,
          partner.id,
          matchCriteria.language,
          questionId,
          questionTitle
        );
        setIsDocumentLoaded(true);
      }
    };
    loadTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReadOnly, isEditorReady, editorState]);

  return (
    <CodeMirror
      ref={onEditorReady}
      style={{ height: "100%", width: "100%", fontSize: "14px" }}
      height="100%"
      width="100%"
      basicSetup={false}
      id="codeEditor"
      onChange={handleChange}
      extensions={[
        indentUnit.of("\t"),
        basicSetup(),
        languageSupport[language as keyof typeof languageSupport],
        ...(!isReadOnly && editorState
          ? [
              yCollab(editorState.text, editorState.awareness),
              cursorExtension(roomId, uid, username),
            ]
          : []),
        EditorView.lineWrapping,
        EditorView.editable.of(!isReadOnly && isDocumentLoaded),
        EditorState.readOnly.of(isReadOnly || !isDocumentLoaded),
      ]}
      value={isReadOnly ? template : undefined}
      placeholder={
        !isReadOnly && !isDocumentLoaded ? "Loading the code..." : undefined
      }
    />
  );
};

export default CodeEditor;
