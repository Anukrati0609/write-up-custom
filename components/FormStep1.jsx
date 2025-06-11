import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaCalendarAlt, FaUniversity } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import { MdKeyboardArrowRight } from "react-icons/md";

const FormStep1 = ({ formData, setFormData, onNext }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
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
          Personal Information
        </h2>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          variants={inputVariants}
          initial="initial"
          animate="animate"
          custom={1}
          className="group"
        >
          {" "}
          <label
            htmlFor="fullName"
            className="text-sm font-medium text-slate-300 mb-2 flex items-center space-x-1.5"
          >
            <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
              <FaUser size={14} />
            </span>
            <span>Full Name</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500/70 group-hover:text-blue-400/90 transition-colors">
              <FaUser size={16} />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3.5 bg-slate-800/80 border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white shadow-inner transition-all group-hover:bg-slate-800 group-hover:border-blue-500/50"
              placeholder="Enter your full name"
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
          {" "}
          <label
            htmlFor="year"
            className="text-sm font-medium text-slate-300 mb-2 flex items-center space-x-1.5"
          >
            <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
              <FaCalendarAlt size={14} />
            </span>
            <span>Year</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500/70 group-hover:text-blue-400/90 transition-colors">
              <FaCalendarAlt size={16} />
            </div>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-3.5 bg-slate-800/80 border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white shadow-inner transition-all appearance-none group-hover:bg-slate-800 group-hover:border-blue-500/50"
              style={{ color: "white", backgroundColor: "#1e293b" }}
            >
              <option
                value=""
                disabled
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                Select your year
              </option>
              <option
                value="1"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                1st Year
              </option>
              <option
                value="2"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                2nd Year
              </option>
              <option
                value="3"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                3rd Year
              </option>
              <option
                value="4"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                4th Year
              </option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400 group-hover:text-blue-300 transition-colors">
              <HiChevronDown size={20} className="animate-pulse" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={inputVariants}
          initial="initial"
          animate="animate"
          custom={3}
          className="group"
        >
          {" "}
          <label
            htmlFor="branch"
            className="text-sm font-medium text-slate-300 mb-2 flex items-center space-x-1.5"
          >
            <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
              <FaUniversity size={14} />
            </span>
            <span>Branch</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500/70 group-hover:text-blue-400/90 transition-colors">
              <FaUniversity size={16} />
            </div>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-3.5 bg-slate-800/80 border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white shadow-inner transition-all appearance-none group-hover:bg-slate-800 group-hover:border-blue-500/50"
              style={{ color: "white", backgroundColor: "#1e293b" }}
            >
              <option
                value=""
                disabled
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                Select your branch
              </option>
              <option
                value="CSE"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                Computer Science Engineering
              </option>
              <option
                value="IT"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                Information Technology
              </option>
              <option
                value="ECE"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                Electronics & Communication
              </option>
              <option
                value="EE"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                Electrical Engineering
              </option>
              <option
                value="ME"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                Mechanical Engineering
              </option>
              <option
                value="CE"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                Civil Engineering
              </option>
              <option
                value="CHE"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                Chemical Engineering
              </option>
              <option
                value="Other"
                style={{ backgroundColor: "#1e293b", color: "white" }}
              >
                Other
              </option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400 group-hover:text-blue-300 transition-colors">
              <HiChevronDown size={20} className="animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        type="submit"
        className="w-full py-3.5 mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center group relative overflow-hidden"
        variants={inputVariants}
        initial="initial"
        animate="animate"
        custom={4}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10">Next Step</span>
        <MdKeyboardArrowRight className="h-5 w-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity" />
      </motion.button>
    </motion.form>
  );
};

export default FormStep1;
