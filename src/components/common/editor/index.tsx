import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  /*
   * Quill editor toolbars
   * See https://quilljs.com/docs/modules/toolbar/
   */
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
  clipboard: { matchVisual: false },
};

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

export default function QuillEditor() {
  return (
    <QuillNoSSRWrapper
      modules={modules}
      formats={formats}
      theme="snow"
      placeholder="Post Your Message Here..."
    />
  );
}
