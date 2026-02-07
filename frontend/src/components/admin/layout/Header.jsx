import { FaBars } from "react-icons/fa";

export default function Header({ onToggle }) {
  return (
    <div className="h-14 bg-white shadow-sm flex items-center px-4">
      <button
        onClick={onToggle}
        className="text-gray-700 text-lg mr-4"
      >
        <FaBars className="cursor-pointer" />
      </button>
      <h1 className="font-semibold">Admin Panel</h1>
    </div>
  );
}
