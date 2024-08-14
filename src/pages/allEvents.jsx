// src/pages/AllEvents.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateEvent from './CreateEvent';
import UpdateEvent from './UpdateEvent'; // Import UpdateEvent component
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllEvents = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openUpdateModal = (event) => {
    setSelectedEvent(event);
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => {
    setSelectedEvent(null);
    setIsUpdateModalOpen(false);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/event/delete-event/${id}`);
      setEvents(events.filter(event => event.id !== id));
      toast.success('Event deleted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Reload after 2 seconds to show the toast notification
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event. Please try again.');
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/event/all-events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Events</h1>
        <button onClick={openCreateModal} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Add Event
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <img src={`http://localhost:8000/${event.eventPhoto}`} alt={event.eventTitle} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{event.eventTitle}</h2>
              <p className="text-gray-700 mb-4">{truncateText(event.eventDescription, 20)}</p>
              <div className="flex justify-between">
                <button onClick={() => openUpdateModal(event)} className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                  Update
                </button>
                <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-lg mx-auto">
            <button onClick={closeCreateModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold p-2">
              &times;
            </button>
            <CreateEvent closeModal={closeCreateModal} />
          </div>
        </div>
      )}

      {/* Update Event Modal */}
      {isUpdateModalOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-lg mx-auto">
            <button onClick={closeUpdateModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold p-2">
              &times;
            </button>
            <UpdateEvent event={selectedEvent} closeModal={closeUpdateModal} />
          </div>
        </div>
      )}
    </div>
  );
};

// Function to truncate text
const truncateText = (text, wordLimit) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

export default AllEvents;
