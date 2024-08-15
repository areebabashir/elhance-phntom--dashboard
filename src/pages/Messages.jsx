import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/contact/allcontacts');
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleSelectChange = (messageId) => {
    setSelectedMessages((prevSelected) => 
      prevSelected.includes(messageId) 
        ? prevSelected.filter(id => id !== messageId) 
        : [...prevSelected, messageId]
    );
  };

  const handleDelete = async () => {
    try {
      await Promise.all(selectedMessages.map(id =>
        axios.delete(`http://localhost:8000/api/v1/contact/${id}`)
      ));
      setMessages(prevMessages => prevMessages.filter(msg => !selectedMessages.includes(msg._id)));
      setSelectedMessages([]);
      toast.success('Selected messages deleted successfully'); // Show success toast
    } catch (error) {
      console.error('Error deleting messages:', error);
      toast.error('Error deleting messages'); // Show error toast
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;
  }



  // Exclude messages with status 'archived' from being displayed
  const filteredMessages = messages.filter(msg => msg.status !== 'archived');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="mb-4">
        {selectedMessages.length > 0 && (
          <button 
            onClick={handleDelete} 
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete Selected
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="py-3 px-4 text-left text-gray-600 text-sm md:text-base">
                <input
                  type="checkbox"
                  onChange={() => {
                    if (selectedMessages.length === filteredMessages.length) {
                      setSelectedMessages([]);
                    } else {
                      setSelectedMessages(filteredMessages.map(msg => msg._id));
                    }
                  }}
                  checked={selectedMessages.length === filteredMessages.length}
                />
              </th>
              <th className="py-3 px-4 text-left text-gray-600 text-sm md:text-base">Name</th>
              <th className="py-3 px-4 text-left text-gray-600 text-sm md:text-base">Email</th>
              <th className="py-3 px-4 text-left text-gray-600 text-sm md:text-base">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((msg, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 text-sm md:text-base">
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(msg._id)}
                    onChange={() => handleSelectChange(msg._id)}
                  />
                </td>
                <td className="py-3 px-4 text-sm md:text-base">{msg.name}</td>
                <td className="py-3 px-4 text-sm md:text-base">{msg.email}</td>
                
                <td className="py-3 px-4 text-sm md:text-base">
                  <Link to={`/messages/${msg._id}`} className="text-blue-500 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </div>
  );
};

export default Messages;
