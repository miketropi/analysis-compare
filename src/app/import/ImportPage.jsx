'use client';

import { useState } from 'react';
import Section from "@/components/Section";

export default function ImportPage() {
  const [jsonData, setJsonData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleImport = async () => {
    if (!jsonData.trim()) {
      setMessage('Please enter JSON data');
      setMessageType('error');
      return;
    }

    try {
      // Validate JSON format
      const parsedData = JSON.parse(jsonData);
      
      setIsLoading(true);
      setMessage('');
      setMessageType('');

      const response = await fetch('/api/post-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      if (response.ok) {
        setMessage('Reports imported successfully!');
        setMessageType('success');
        setJsonData(''); // Clear the textarea
      } else {
        const errorData = await response.json();
        setMessage(`Import failed: ${errorData.error || 'Unknown error'}`);
        setMessageType('error');
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        setMessage('Invalid JSON format. Please check your input.');
        setMessageType('error');
      } else {
        setMessage(`Import failed: ${error.message}`);
        setMessageType('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setJsonData('');
    setMessage('');
    setMessageType('');
  };

  return (
    <>
      <Section>
        <div className="max-w-4xl mx-auto">
          <h1 className="font-bold mb-8">Import Reports</h1>
          
          <div className="">
            <div className="mb-4">
              <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 mb-2">
                JSON Data
              </label>
              <textarea
                id="json-input"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder="Paste your JSON data here..."
                className="w-full h-96 p-4 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>

            {message && (
              <div className={`mb-4 p-4 rounded-md font-mono text-sm ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleImport}
                disabled={isLoading || !jsonData.trim()}
                className={`px-6 py-2 text-sm font-mono ${
                  isLoading || !jsonData.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? 'Importing...' : 'Import Reports'}
              </button>
              
              <button
                onClick={handleClear}
                className="px-6 py-2 text-sm font-mono bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500"
              >
                Clear
              </button>
            </div>

        
          </div>
        </div>
      </Section>
    </>
  );
}