import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import * as XLSX from 'xlsx'; // Import xlsx library

const JoiningResponse = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data
    const fetchResponses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/form/all-responses'); 
        setResponses(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  const downloadExcel = () => {
    // Convert responses data to a worksheet
    const ws = XLSX.utils.json_to_sheet(responses);
    
    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');
    
    // Write the workbook to a file
    XLSX.writeFile(wb, 'responses.xlsx');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="relative pt-16 md:pr-0 p grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Button for downloading Excel */}
      <button 
        onClick={downloadExcel}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
      >
        Download Responses as Excel
      </button>
      
      {/* Display responses */}
      {responses.map((response, index) => (
        <div key={index} className="bg-white p-6 border border-gray-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">{response.name}</h2>
          <p><strong>Selected Option:</strong> {response.selectedOption}</p>
          <p><strong>Email:</strong> {response.email}</p>
          <p><strong>Whatsapp:</strong> {response.whatsapp}</p>
          <p><strong>Department:</strong> {response.department}</p>
          <p><strong>Role:</strong> {response.selectedRole}</p>
          <p><strong>Vision:</strong> {response.vision}</p>
        </div>
      ))}
    </div>
  );
};

export default JoiningResponse;
