import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;
  }

  // Function to truncate message to 10 words
  const truncateMessage = (message, wordLimit = 10) => {
    const words = message.split(' ');
    if (words.length <= wordLimit) return message;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="py-3 px-4 text-left text-gray-600 text-sm md:text-base">Name</th>
              <th className="py-3 px-4 text-left text-gray-600 text-sm md:text-base">Email</th>
              <th className="py-3 px-4 text-left text-gray-600 text-sm md:text-base">Message</th>
              <th className="py-3 px-4 text-left text-gray-600 text-sm md:text-base">Details</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 text-sm md:text-base">{msg.name}</td>
                <td className="py-3 px-4 text-sm md:text-base">{msg.email}</td>
                <td className="py-3 px-4 text-sm md:text-base break-words whitespace-normal">
                  {truncateMessage(msg.message)} 
                </td>
                <td className="py-3 px-4 text-sm md:text-base">
                  <Link to={`/messages/${msg._id}`} className="text-blue-500 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Messages;
