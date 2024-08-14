import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const CreateEvent = ({ closeModal }) => {
  const [formValues, setFormValues] = useState({
    eventPhoto: null,
    eventTitle: '',
    eventDescription: '',
    speakerPhoto: null,
    speakerName: '',
    aboutSpeaker: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    setFormValues({
      ...formValues,
      [id]: files[0],
    });
  };

  const validate = () => {
    const errors = {};

    if (!formValues.eventPhoto) errors.eventPhoto = 'Event Image is required';
    if (!formValues.eventTitle) errors.eventTitle = 'Event Title is required';
    if (!formValues.eventDescription) errors.eventDescription = 'Event Description is required';
    if (!formValues.speakerPhoto) errors.speakerPhoto = 'Speaker Image is required';
    if (!formValues.speakerName) errors.speakerName = 'Speaker Name is required';
    if (!formValues.aboutSpeaker) errors.aboutSpeaker = 'About Speaker is required';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('eventPhoto', formValues.eventPhoto);
      formData.append('speakerPhoto', formValues.speakerPhoto);
      formData.append('eventTitle', formValues.eventTitle);
      formData.append('eventDescription', formValues.eventDescription);
      formData.append('speakerName', formValues.speakerName);
      formData.append('aboutSpeaker', formValues.aboutSpeaker);

      const response = await axios.post('http://localhost:8000/api/v1/event/create-event', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response);

      if (response.status === 201) {
        toast.success('Event created successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Reload after 2 seconds to show the toast notification
      }
      
    } catch (error) {
      toast.error('Error creating event');
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="md:w-3/4 mx-auto w-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Add New Event</h2>

        <div className="mb-4">
          <label htmlFor="eventPhoto" className="block text-gray-700 mb-2">Event Image:</label>
          <input
            type="file"
            id="eventPhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.eventPhoto && <div className="text-red-500 text-sm">{errors.eventPhoto}</div>}
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
          {errors.eventTitle && <div className="text-red-500 text-sm">{errors.eventTitle}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="eventDescription" className="block text-gray-700 mb-2">Event Description:</label>
          <textarea
            id="eventDescription"
            value={formValues.eventDescription}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
          {errors.eventDescription && <div className="text-red-500 text-sm">{errors.eventDescription}</div>}
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
          {errors.speakerPhoto && <div className="text-red-500 text-sm">{errors.speakerPhoto}</div>}
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
          {errors.speakerName && <div className="text-red-500 text-sm">{errors.speakerName}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="aboutSpeaker" className="block text-gray-700 mb-2">About Speaker:</label>
          <textarea
            id="aboutSpeaker"
            value={formValues.aboutSpeaker}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
          {errors.aboutSpeaker && <div className="text-red-500 text-sm">{errors.aboutSpeaker}</div>}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Event
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateEvent;
