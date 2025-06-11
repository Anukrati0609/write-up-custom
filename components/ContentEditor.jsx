import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import TextStyle from "@tiptap/extension-text-style";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaHeading,
  FaEraser,
} from "react-icons/fa";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 py-2 px-3 bg-slate-800 rounded-t-lg border-b border-slate-600">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-slate-700 ${
          editor.isActive("bold")
            ? "bg-blue-600/40 text-blue-300"
            : "text-slate-300"
        }`}
        title="Bold"
      >
        <FaBold size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-slate-700 ${
          editor.isActive("italic")
            ? "bg-blue-600/40 text-blue-300"
            : "text-slate-300"
        }`}
        title="Italic"
      >
        <FaItalic size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded hover:bg-slate-700 ${
          editor.isActive("underline")
            ? "bg-blue-600/40 text-blue-300"
            : "text-slate-300"
        }`}
        title="Underline"
      >
        <FaUnderline size={14} />
      </button>

      <div className="w-px h-6 bg-slate-600 mx-1 self-center"></div>

      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-1.5 rounded hover:bg-slate-700 ${
          editor.isActive({ textAlign: "left" })
            ? "bg-blue-600/40 text-blue-300"
            : "text-slate-300"
        }`}
        title="Align left"
      >
        <FaAlignLeft size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-1.5 rounded hover:bg-slate-700 ${
          editor.isActive({ textAlign: "center" })
            ? "bg-blue-600/40 text-blue-300"
            : "text-slate-300"
        }`}
        title="Align center"
      >
        <FaAlignCenter size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-1.5 rounded hover:bg-slate-700 ${
          editor.isActive({ textAlign: "right" })
            ? "bg-blue-600/40 text-blue-300"
            : "text-slate-300"
        }`}
        title="Align right"
      >
        <FaAlignRight size={14} />
      </button>

      <div className="w-px h-6 bg-slate-600 mx-1 self-center"></div>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded hover:bg-slate-700 ${
          editor.isActive("heading", { level: 2 })
            ? "bg-blue-600/40 text-blue-300"
            : "text-slate-300"
        }`}
        title="Heading 2"
      >
        <FaHeading size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1.5 rounded hover:bg-slate-700 ${
          editor.isActive("heading", { level: 3 })
            ? "bg-blue-600/40 text-blue-300"
            : "text-slate-300"
        }`}
        title="Heading 3"
      >
        <div className="flex items-center">
          <FaHeading size={12} />
          <span className="text-xs">3</span>
        </div>
      </button>

      <div className="w-px h-6 bg-slate-600 mx-1 self-center"></div>

      <button
        onClick={() => editor.commands.clearContent()}
        className="p-1.5 rounded hover:bg-slate-700 text-slate-300"
        title="Clear content"
      >
        <FaEraser size={14} />
      </button>
    </div>
  );
};

const ContentEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextStyle,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-lg shadow-inner">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none p-4 min-h-[240px] focus:outline-none"
      />
      <style jsx global>{`
        .ProseMirror {
          min-height: 240px;
          outline: none;
          color: white;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
          color: #93c5fd;
        }
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
          color: #93c5fd;
        }
      `}</style>
    </div>
  );
};

export default ContentEditor;
