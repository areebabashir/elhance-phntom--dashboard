import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateEvent = ({ event, closeModal }) => {
  const [formValues, setFormValues] = useState({
    eventPhoto: event.eventPhoto || '',
    eventTitle: event.eventTitle || '',
    eventDescription: event.eventDescription || '',
    speakerPhoto: event.speakerPhoto || '',
    speakerName: event.speakerName || '',
    aboutSpeaker: event.aboutSpeaker || '',
  });

  const [fileNames, setFileNames] = useState({
    eventPhoto: '',
    speakerPhoto: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { id } = e.target;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormValues((prevValues) => ({
          ...prevValues,
          [id]: reader.result,
        }));
        setFileNames((prevNames) => ({
          ...prevNames,
          [id]: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formValues);
    console.log(fileNames);

    const formData = new FormData();
    formData.append('eventTitle', formValues.eventTitle);
    formData.append('eventDescription', formValues.eventDescription);
    formData.append('speakerName', formValues.speakerName);
    formData.append('aboutSpeaker', formValues.aboutSpeaker);

    if (formValues.eventPhoto && fileNames.eventPhoto) {
      formData.append('eventPhoto', formValues.eventPhoto);
    }

    if (formValues.speakerPhoto && fileNames.speakerPhoto) {
      formData.append('speakerPhoto', formValues.speakerPhoto);
    }

    try {
      await axios.put(`http://localhost:8000/api/v1/event/update-event/${event._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Event updated successfully!');
      // setTimeout(() => {
      //   window.location.reload();
      //   closeModal();
      // }, 2000);
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Error updating event');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Update Event</h2>

        <div className="mb-4">
          <label htmlFor="eventPhoto" className="block text-gray-700 mb-2">Event Image:</label>
          <input
            type="file"
            id="eventPhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="mt-2 text-sm text-gray-500">{fileNames.eventPhoto || 'No file chosen'}</p>
        </div>

        <div className="mb-4">
          <label htmlFor="eventTitle" className="block text-gray-700 mb-2">Event Title:</label>
          <input
            type="text"
            id="eventTitle"
            value={formValues.eventTitle}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="eventDescription" className="block text-gray-700 mb-2">Event Description:</label>
          <textarea
            id="eventDescription"
            value={formValues.eventDescription}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="speakerPhoto" className="block text-gray-700 mb-2">Speaker Image:</label>
          <input
            type="file"
            id="speakerPhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="mt-2 text-sm text-gray-500">{fileNames.speakerPhoto || 'No file chosen'}</p>
        </div>

        <div className="mb-4">
          <label htmlFor="speakerName" className="block text-gray-700 mb-2">Speaker Name:</label>
          <input
            type="text"
            id="speakerName"
            value={formValues.speakerName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="aboutSpeaker" className="block text-gray-700 mb-2">About Speaker:</label>
          <textarea
            id="aboutSpeaker"
            value={formValues.aboutSpeaker}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Update Event
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateEvent;
