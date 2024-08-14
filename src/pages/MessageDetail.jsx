import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters

const MessageDetail = () => {
  const { id } = useParams(); // Get message ID from URL
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/contact/${id}`);
        setMessage(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Message Details</h1>
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-lg">
        <p><strong>Name:</strong> {message.name}</p>
        <p><strong>Email:</strong> {message.email}</p>
        <p><strong>Message:</strong></p>
        <p>{message.message}</p>
      </div>
    </div>
  );
};

export default MessageDetail;
