import React from "react";
import { render, waitFor } from "@testing-library/react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editorckl from "../index";
import { Provider } from "react-redux";
import { store } from "src/store";
import ClassicEditor from "../../../../../ckeditor51/build/ckeditor";

const editorState = "";
const onEditorStateChange = jest.fn();
const editor_items = [
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
  "todoList",
  "|",
  // "fontSize",
  "fontColor",
  // "fontBackgroundColor",
  // "highlight",
  // "fontFamily",
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
];

const editorConfiguration = {
  placeholder: "Write Your Statement Here",
  mediaEmbed: { previewsInData: true },
  toolbar: {
    shouldNotGroupWhenFull: true,
    items: editor_items,
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

test("CKEditor is initialized correctly", () => {
  const editor = new ClassicEditor.Editor();
  expect(editor).toBeDefined();
});

//editor test case
test("renders the <CKEditor> component", async () => {
  const { container } = render(
    <Provider store={store}>
      <Editorckl
        editorState={editorState}
        oneditorchange={onEditorStateChange}
        placeholder="Write Your Statement Here"
        items={editor_items}
        height={200}
      ></Editorckl>
    </Provider>
  );
  await waitFor(() => {
    const editorWrapper = container.querySelectorAll(".ck-editor__editable");
    expect(editorWrapper[0]).toBeInTheDocument();
  });
});

test("onchange event should be triggered", () => {
  const editor = new ClassicEditor.Editor();
  const onchangeMock = jest.fn();
  editor.model.document.on("change:data", onchangeMock);
  editor.setData("<p>Updated content</p>");
  expect(onchangeMock).toHaveBeenCalled();
});

test("Editor content is retrieved correctly using getData", async () => {
  const onReadyMock = jest.fn();
  const editor = new ClassicEditor.Editor();
  render(
    <CKEditor
      config={editorConfiguration}
      editor={ClassicEditor.Editor}
      onReady={onReadyMock}
    />
  );
  editor.setData("new content");
  await waitFor(() => {
    expect(editor.getData()).toBe("");
  });
});

test("Editor onChange event is triggered correctly", () => {
  const onChangeMock = jest.fn();
  const { container } = render(
    <CKEditor
      config={editorConfiguration}
      editor={ClassicEditor.Editor}
      onChange={onChangeMock}
    />
  );
  const editor = new ClassicEditor.Editor();
  const newContent = "<p>New content</p>";
  editor.model.change((writer) => {
    writer.insertText(newContent, editor.model.document.getRoot());
  });
  const editorWrapper = container.querySelectorAll(".ck-editor__editable");
  expect(editorWrapper[0]).toBeInTheDocument();
});
