import { useState, useEffect } from "react";
import { Skeleton } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import ClassicEditor from "../../../../ckeditor51/build/ckeditor";
import isAuth from "../../../hooks/isUserAuthenticated";

interface editorState {
  editorState: string;
}
interface editorchange {
  // eslint-disable-next-line no-unused-vars
  oneditorchange: (any) => void;
}

interface placeholder {
  placeholder: string;
}

interface toolbaritems {
  items: Array<string>;
}

interface height {
  height?: number;
}

export default function Editorck(
  props: editorState & editorchange & placeholder & toolbaritems & height
) {
  const { isUserAuthenticated } = isAuth();
  const [loadeditor, setLoadeditor] = useState(false);
  const [editordata, setEditordata] = useState("");

  useEffect(() => {
    setEditordata(props.editorState);
    setLoadeditor(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated, props.editorState]);

  const editorConfiguration = {
    innerHeight: 200,
    placeholder: props.placeholder,
    mediaEmbed: { previewsInData: true },
    toolbar: {
      shouldNotGroupWhenFull: true,
      items: props.items,
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
            editor.editing.view.document.on("click", () => {
              props.oneditorchange(editor?.getData());
            });

            editor.editing.view.document.on("blur", () => {
              props.oneditorchange(editor?.getData());
            });

            if (props.height)
              editor.editing.view.change((writer) => {
                writer.setStyle(
                  "height",
                  `${props.height}px`,
                  editor.editing.view.document.getRoot()
                );
              });

            editor.editing.view.focus();
          }}
          onChange={(event, editor: any) => {
            // let isTyping = false;
            let typingTimer;
            const dataAppend = async () => {
              return props.oneditorchange(editor?.getData());
            };

            editor.editing.view.document.on("keyup", (evt) => {
              clearTimeout(typingTimer);
              typingTimer = setTimeout(async () => {
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
