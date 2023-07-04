import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor51/build/ckeditor";
import { useState, useEffect } from "react";
import { Skeleton } from "antd";
import isAuth from "../../../hooks/isUserAuthenticated";

interface editorState {
  editorState: string;
}

interface editorchange {
  oneditorchange: (changedata: string | undefined) => void;
}

export default function Editorck(props: editorState & editorchange) {
  const { isUserAuthenticated } = isAuth();
  const [loadeditor, setLoadeditor] = useState(false);
  const [editordata, setEditordata] = useState("");

  useEffect(() => {
    setEditordata(props.editorState);
    setLoadeditor(true);
  }, [isUserAuthenticated]);

  const editorConfiguration = {
    placeholder: "Write Your Statement Here",
    mediaEmbed: { previewsInData: true },
    toolbar: {
      shouldNotGroupWhenFull: true,
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "superscript",
        "subscript",
        "|",
        "numberedList",
        "bulletedList",
        "alignment",
        "|",
        "fontSize",
        "fontColor",
        "fontBackgroundColor",
        "highlight",
        "fontFamily",
        "|",
        "indent",
        "outdent",
        "|",
        "link",
        "autolink",
        "imageInsert",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "|",
        "findAndReplace",
        "horizontalLine",
        "pageBreak",
        "specialCharacters",
        "|",
        "undo",
        "redo",
      ],
    },
    image: {
      toolbar: [
        "imageTextAlternative",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "linkImage",
      ],
    },
  };

  return (
    <div>
      {loadeditor ? (
        <CKEditor
          config={editorConfiguration}
          editor={ClassicEditor.Editor}
          data={editordata}
          onReady={(editor) => {
            editor.editing.view.focus();
            editor.editing.view.document.on("click", () => {
              console.log("Clicked");
              props.oneditorchange(editor?.getData());
              console.log("data sent");
            });
          }}
          onChange={(event, editor: any) => {
            let isTyping = false;
            let typingTimer;
            const dataAppend = async () => {
              return props.oneditorchange(editor?.getData());
            };

            editor.editing.view.document.on("keyup", (evt) => {
              clearTimeout(typingTimer);
              isTyping = true;
              typingTimer = setTimeout(async () => {
                isTyping = false;
                await dataAppend();
              }, 500);
              evt.stop();
            });
          }}
        />
      ) : (
        <div>
          <Skeleton />
        </div>
      )}
    </div>
  );
}
