import  { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faEnvelope, faUserCheck, faCalendar, faPlus, faEdit, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png';
import { AuthContext} from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="sticky top-0 left-0 w-16 md:w-96 h-screen bg-gray-800 text-white flex flex-col z-50">
      {/* Header */}
      <div className="text-center p-6 flex flex-col">
        <img src={logo} alt="Logo" className="md:w-24 md:h-24 mb-2 md:block hidden" />
        <h2 className="text-2xl md:text-3xl hidden md:block">Elhance Phantom</h2>
      </div>

      {/* Menu */}
      <div className="flex-1 flex flex-col items-center">
        <nav className="flex flex-col w-full md:pl-6">
          <Link to="/" className="flex items-center py-3 px-4 md:px-6 text-white hover:bg-gray-700 w-full text-center">
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-2 md:mr-3 text-lg md:text-xl" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link to="/messages" className="flex items-center py-3 px-4 md:px-6 text-white hover:bg-gray-700 w-full text-center">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2 md:mr-3 text-lg md:text-xl" />
            <span className="hidden md:inline">Messages</span>
          </Link>
          <Link to="/joining-response" className="flex items-center py-3 px-4 md:px-6 text-white hover:bg-gray-700 w-full text-center">
            <FontAwesomeIcon icon={faUserCheck} className="mr-2 md:mr-3 text-lg md:text-xl" />
            <span className="hidden md:inline">Joining-response</span>
          </Link>
          <Link to="/all-events" className="flex items-center py-3 px-4 md:px-6 text-white hover:bg-gray-700 w-full text-center">
            <FontAwesomeIcon icon={faCalendar} className="mr-2 md:mr-3 text-lg md:text-xl" />
            <span className="hidden md:inline">All-Events</span>
          </Link>

         
        </nav>
      </div>

      {/* Footer */}
      <div className="p-6 text-center flex flex-col">
       
        <button onClick={handleLogout}  className="md:bg-green-500 text-white py-2 md:px-4 rounded flex md:items-center md:justify-center hover:bg-green-600">
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-lg md:text-xl" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
