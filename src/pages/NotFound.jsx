import { Link } from "react-router-dom";
import { FaGhost } from "react-icons/fa";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="mb-4"
      >
        <FaGhost className="text-7xl text-emerald-400 drop-shadow" />
      </motion.div>

      <h1 className="text-5xl font-extrabold text-emerald-600 mb-2">Boo! 👻</h1>
      <p className="text-slate-500 mb-6 text-lg">
        Looks like this page vanished into thin air.
      </p>

      <Link
        to="/"
        className="px-5 py-2.5 bg-emerald-500 text-white rounded-full shadow hover:bg-emerald-600 transition"
      >
        Take me home 🏠
      </Link>
    </div>
  );
};

export default NotFound;
