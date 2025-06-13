import React from "react";
import Image from "next/image";
import Link from "next/link";

const RegisterCard = () => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-slate-700 max-w-md w-full">
      <div className="flex items-center justify-center mb-6">
        <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <Image
            src="/file.svg"
            alt="WriteItUp"
            width={24}
            height={24}
            className="text-white"
          />
        </div>
        <h2 className="text-2xl font-bold ml-4 text-white">Join WriteItUp</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center">
            <Image
              src="/globe.svg"
              alt="Competition"
              width={20}
              height={20}
              className="text-white"
            />
          </div>
          <div>
            <h3 className="text-slate-400 text-sm">Competition Date</h3>
            <p className="text-white font-medium">June 15 - June 30, 2025</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center">
            <Image
              src="/window.svg"
              alt="Deadline"
              width={20}
              height={20}
              className="text-white"
            />
          </div>
          <div>
            <h3 className="text-slate-400 text-sm">Registration Closes</h3>
            <p className="text-white font-medium">June 14, 2025</p>
          </div>
        </div>
      </div>

      <Link href="/register" className="block">
        <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all">
          Register Now
        </button>
      </Link>

      <p className="text-center text-slate-400 text-sm mt-4">
        Already registered?
        <Link href="/login" className="text-blue-400 hover:text-blue-300">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterCard;
