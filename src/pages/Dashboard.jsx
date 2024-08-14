import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [newMessages, setNewMessages] = useState(0);
  const [notification, setNotification] = useState('');

  const fetchData = async () => {
    try {
      const eventsResponse = await axios.get('http://localhost:8000/api/v1/event/all-events'); // Update this endpoint as necessary
      const responsesResponse = await axios.get('http://localhost:8000/api/v1/form/all-responses'); // Update this endpoint as necessary
      const messagesResponse = await axios.get('http://localhost:8000/api/v1/contact/allcontacts'); // Update this endpoint as necessary

      setTotalEvents(eventsResponse.data.length); // Adjust based on your API response structure
      setTotalResponses(responsesResponse.data.length); // Adjust based on your API response structure
      setNewMessages(messagesResponse.data.filter(message => !message.read).length); // Adjust based on your API response structure
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000); // Poll every 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const responsesResponse = await axios.get('http://localhost:8000/api/v1/form/all-responses');
        const messagesResponse = await axios.get('http://localhost:8000/api/v1/contact/allcontacts');

        const newResponses = responsesResponse.data.length;
        const newUnreadMessages = messagesResponse.data.filter(message => !message.read).length;

        if (newResponses > totalResponses) {
          setNotification('New response received!');
        }

        if (newUnreadMessages > newMessages) {
          setNotification('New message received!');
        }

        setTotalResponses(newResponses);
        setNewMessages(newUnreadMessages);
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    const intervalId = setInterval(() => {
      checkForUpdates();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [totalResponses, newMessages]);

  return (
    <div className="p-6 flex flex-col space-y-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Total Events */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Total Events</h2>
          <p className="text-4xl font-bold">{totalEvents}</p>
        </div>
        {/* Total Responses */}
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Total Responses</h2>
          <p className="text-4xl font-bold">{totalResponses}</p>
        </div>
        {/* New Messages */}
        <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">New Messages</h2>
          <p className="text-4xl font-bold">{newMessages}</p>
        </div>
      </div>
      {notification && <div className="bg-yellow-500 text-white p-4 rounded-lg mt-4">{notification}</div>}
    </div>
  );
};

export default Dashboard;
