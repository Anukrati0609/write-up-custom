import React from "react";
import { motion } from "framer-motion";
import ContentEditor from "./ContentEditor";
import { FaFileAlt, FaKeyboard } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdCheck } from "react-icons/md";

const FormStep2 = ({
  formData,
  setFormData,
  onSubmit,
  onBack,
  loading = false,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (html) => {
    setFormData((prev) => ({
      ...prev,
      content: html,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Only submit if it's a genuine user-initiated submission
    // Check if the submit button was explicitly clicked or if using the submitter property
    const submitter = e.nativeEvent.submitter;
    const isExplicitSubmit =
      (submitter && submitter.id === "submit-form-btn") ||
      (submitter && submitter.getAttribute("data-user-clicked") === "true");

    if (isExplicitSubmit) {
      onSubmit();
    }
  };

  const inputVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 },
    }),
  };
  return (
    <motion.form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        // Prevent form submission on Enter key press except in single-line inputs
        if (e.key === "Enter" && e.target.tagName !== "INPUT") {
          e.preventDefault();
        }
      }}
      className="space-y-5 p-6 backdrop-blur-md bg-gradient-to-br from-slate-900/80 to-slate-800/70 rounded-xl border border-slate-700/50 shadow-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex items-center space-x-2 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-8 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-full" />
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          Content Information
        </h2>
      </motion.div>

      <div className="space-y-8">
        <motion.div
          variants={inputVariants}
          initial="initial"
          animate="animate"
          custom={1}
          className="group"
        >
          <label
            htmlFor="title"
            className="text-sm font-medium text-slate-300 mb-2 flex items-center space-x-1.5"
          >
            <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
              <FaFileAlt size={14} />
            </span>
            <span>Title</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500/70 group-hover:text-blue-400/90 transition-colors">
              <FaFileAlt size={16} />
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3.5 bg-slate-800/80 border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white shadow-inner transition-all group-hover:bg-slate-800 group-hover:border-blue-500/50"
              placeholder="Enter your submission title"
            />
            <div className="absolute top-1/2 right-3 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </motion.div>

        <motion.div
          variants={inputVariants}
          initial="initial"
          animate="animate"
          custom={2}
          className="group"
        >
          <label
            htmlFor="content"
            className="text-sm font-medium text-slate-300 mb-2 flex items-center space-x-1.5"
          >
            <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
              <FaKeyboard size={14} />
            </span>
            <span>Content</span>
          </label>
          <div className="relative">
            <ContentEditor
              content={formData.content}
              onChange={handleContentChange}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 pt-6 mt-6"
        variants={inputVariants}
        initial="initial"
        animate="animate"
        custom={3}
      >
        <motion.button
          type="button"
          onClick={onBack}
          className="py-3.5 px-6 bg-slate-700/80 hover:bg-slate-600/90 text-white font-medium rounded-lg transition-all border border-slate-600/50 shadow-lg flex items-center justify-center group relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MdKeyboardArrowLeft className="h-5 w-5 mr-2 relative z-10 group-hover:-translate-x-1 transition-transform" />
          <span className="relative z-10">Back</span>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-500 opacity-0 group-hover:opacity-20 transition-opacity" />
        </motion.button>{" "}
        <motion.button
          type="submit"
          disabled={loading}
          id="submit-form-btn"
          onClick={(e) => {
            // Explicitly mark this as a user-initiated submit
            if (!loading) {
              e.currentTarget.setAttribute("data-user-clicked", "true");
            }
          }}
          className="flex-1 py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          <span className="relative z-10">
            {loading ? "Submitting..." : "Submit Entry"}
          </span>
          <MdCheck className="h-5 w-5 ml-2 relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity" />
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default FormStep2;
