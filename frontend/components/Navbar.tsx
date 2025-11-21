import { useState } from "react";

interface NavbarProps {
  onGetStarted?: () => void;
}

const Navbar = ({ onGetStarted }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md fixed top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/src/assets/studentflow.png"
            alt="StudentFlow Logo"
            className="w-10 h-10"
          />
          <h1 className="text-xl font-bold text-blue-600">StudentFlow</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
          <button className="hover:text-blue-600">Features</button>
          <button className="hover:text-blue-600">Pricing</button>
          <button className="hover:text-blue-600">About</button>
          <button className="hover:text-blue-600">Contact</button>

          <button className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            onClick={onGetStarted}
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="material-icons text-3xl">menu</span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg flex flex-col px-6 py-4 space-y-3">
          <button className="text-left">Features</button>
          <button className="text-left">Pricing</button>
          <button className="text-left">About</button>
          <button className="text-left">Contact</button>
          <button
            className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-full w-fit"
            onClick={onGetStarted}
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;