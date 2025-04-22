import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Button from "../UIElements/Button";

export default function MainHeader() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold pt-2"
      : "text-gray-700 hover:text-blue-600 pt-2";

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <NavLink to="/" className="text-2xl font-bold text-blue-600">
          MapMates
        </NavLink>

        <nav className="hidden md:flex space-x-6">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          {auth.isLoggedIn && <NavLink to={`/${auth.userId}/places`} className={navLinkClass}>
            My Places
          </NavLink>}
          {auth.isLoggedIn && <NavLink to="/places/new" className={navLinkClass}>
            Add Place
          </NavLink>}
          {!auth.isLoggedIn && <NavLink to="/auth" className={navLinkClass}>
            Sign Up
          </NavLink>}
          {auth.isLoggedIn && (
            <Button
            onClick={() => {
              auth.logout();
              navigate("/");
            }}
              className="text-red-600 font-medium hover:underline"
            >
              Logout
            </Button>
          )}
        </nav>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <NavLink to="/" className={navLinkClass} onClick={toggleMenu}>
              Home
            </NavLink>
            {auth.isLoggedIn && <NavLink to={`/${auth.userId}/places`} className={navLinkClass}>
            My Places
          </NavLink>}
          {auth.isLoggedIn && <NavLink to="/places/new" className={navLinkClass}>
            Add Place
          </NavLink>}
          {!auth.isLoggedIn && <NavLink to="/auth" className={navLinkClass}>
            Sign Up
          </NavLink>}
          {auth.isLoggedIn && (
            <Button
            onClick={() => {
              auth.logout();
              navigate("/");
            }}
              
              className="text-red-600 font-medium hover:underline"
            >
              Logout
            </Button>
          )}
          </nav>
        </div>
      )}
    </header>
  );
}
