import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Skeleton from 'react-loading-skeleton';
import { GiPartyPopper, GiReceiveMoney } from 'react-icons/gi';

// Registering Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [newMessages, setNewMessages] = useState(0);
  const [notification, setNotification] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trafficData, setTrafficData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Traffic Statistics',
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        borderColor: ['#FFF'],
        borderWidth: 1,
      },
    ],
  });

  const notificationSoundUrl = 'public/abc.mp3';
  const [playSound, setPlaySound] = useState(false);

  // Fetching data
  const fetchData = async () => {
    try {
      const eventsResponse = await axios.get('http://localhost:8000/api/v1/event/all-events');
      const responsesResponse = await axios.get('http://localhost:8000/api/v1/form/all-responses');
      const messagesResponse = await axios.get('http://localhost:8000/api/v1/contact/allcontacts');
      const trafficResponse = await axios.get('http://localhost:8000/api/v1/traffic/stats');

      setTotalEvents(eventsResponse.data.length);
      setTotalResponses(responsesResponse.data.length);
      setNewMessages(messagesResponse.data.filter(message => !message.read).length);
      setTrafficData({
        labels: trafficResponse.data.labels,
        datasets: [
          {
            label: 'Traffic Statistics',
            data: trafficResponse.data.data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderColor: ['#FFF'],
            borderWidth: 1,
          },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Fetch data initially and set up intervals
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000); // Fetch data every 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Check for updates
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const responsesResponse = await axios.get('http://localhost:8000/api/v1/form/all-responses');
        const messagesResponse = await axios.get('http://localhost:8000/api/v1/contact/allcontacts');

        const newResponses = responsesResponse.data.length;
        const newUnreadMessages = messagesResponse.data.filter(message => !message.read).length;

        if (newResponses > totalResponses) {
          setNotification('New response received!');
          setPlaySound(true);
        }

        if (newUnreadMessages > newMessages) {
          setNotification('New message received!');
          setPlaySound(true);
        }

        setTotalResponses(newResponses);
        setNewMessages(newUnreadMessages);
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    const intervalId = setInterval(() => {
      checkForUpdates();
    }, 30000); // Check for updates every 30 seconds

    return () => clearInterval(intervalId);
  }, [totalResponses, newMessages]);

  // Play notification sound
  useEffect(() => {
    if (playSound) {
      const audio = new Audio(notificationSoundUrl);
      audio.play();
      setPlaySound(false);
    }
  }, [playSound]);

  // Toggle notification popup
  const handleIconClick = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  if (loading) {
    return (
      <div className="text-center text-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 p-6">
        Loading data, please wait...
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col space-y-6 relative bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
      {/* Notification icon */}
      <div className="relative">
        <FaBell
          className="text-2xl cursor-pointer fixed top-4  right-12"
          onClick={handleIconClick}
          aria-label="Notifications"
        />
        {notification && isPopupVisible && (
          <div
            role="alert"
            aria-live="assertive"
            className="fixed top-16 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-lg transition-transform transform scale-100 z-50"
          >
            {notification}
            <button
              className="ml-4 bg-white text-black px-2 py-1 rounded hover:bg-gray-200"
              onClick={() => setNotification('')}
              aria-label="Close notification"
            >
              Close
            </button>
          </div>
        )}
        {notification && !isPopupVisible && (
          <div className="absolute top-0 right-0 flex items-center justify-center h-3 w-3">
            <span
              className="absolute h-full w-full rounded-full ring-2 ring-white bg-red-400 animate-ping"
            ></span>
          </div>
        )}
      </div>

      {/* Welcome message */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-6 ">
        <h2 className="text-xl font-semibold mb-2">Welcome back, Admin!</h2>
        <p className="text-lg">Here's an overview of the latest stats and updates.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Total Events */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <GiPartyPopper className="text-4xl mb-2" />
          <h2 className="text-xl font-semibold mb-2">Total Events</h2>
          {loading ? <Skeleton height={40} width={100} /> : <p className="text-4xl font-bold">{totalEvents}</p>}
        </div>
        {/* Total Responses */}
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <GiReceiveMoney className="text-4xl mb-2" />
          <h2 className="text-xl font-semibold mb-2">Total Responses</h2>
          {loading ? <Skeleton height={40} width={100} /> : <p className="text-4xl font-bold">{totalResponses}</p>}
        </div>
        {/* New Messages */}
        <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <FaEnvelope className="text-4xl mb-2" />
          <h2 className="text-xl font-semibold mb-2">Total Messages</h2>
          {loading ? <Skeleton height={40} width={100} /> : <p className="text-4xl font-bold">{newMessages}</p>}
        </div>
      </div>

      {/* Traffic Pie Chart and Quick Actions */}
      <div className="mt-8 space-y-6 flex md:flex-row flex-col gap-6">
        {/* Traffic Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex-1">
          <h2 className="text-xl font-semibold mb-4">Traffic Statistics</h2>
          <div className="w-full flex justify-center">
            <div className="w-60 h-60">
              <Pie data={trafficData} />
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-lg flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-center">Quick Actions</h2>
          <div className="flex flex-wrap gap-4 justify-center pt-10">
            <Link
              to="/all-events"
              className="bg-blue-500 text-white rounded-lg p-4 hover:bg-blue-600 transition duration-300 ease-in-out text-lg transform hover:scale-105"
            >
              Create Event
            </Link>
            <Link
              to="/joining-response"
              className="bg-green-500 text-white rounded-lg p-4 hover:bg-green-600 transition duration-300 ease-in-out text-lg transform hover:scale-105"
            >
              View Responses
            </Link>
            <Link
              to="/messages"
              className="bg-red-500 text-white rounded-lg p-4 hover:bg-red-600 transition duration-300 ease-in-out text-lg transform hover:scale-105"
            >
              Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
