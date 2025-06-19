import { Link } from "react-router-dom";
import { FaSadTear } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <FaSadTear className="text-6xl text-slate-400 mb-4" />
      <h1 className="text-4xl font-bold text-slate-700 mb-2">404</h1>
      <p className="text-slate-500 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
