'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Database, Loader2 } from 'lucide-react';

export default function SetupPage() {
  const [status, setStatus] = useState('checking'); // checking, initialized, not-initialized, error
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState(null);

  // Check database status on component mount
  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      setStatus('checking');
      const response = await fetch('/api/init-db');
      const data = await response.json();
      
      if (data.success) {
        if (data.initialized) {
          setStatus('initialized');
          setMessage('Database is already initialized and ready to use');
        } else {
          setStatus('not-initialized');
          setMessage('Database needs to be initialized');
        }
        setDetails(data.tables);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to check database status');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect to database');
      console.error('Database status check error:', error);
    }
  };

  const initializeDatabase = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      const response = await fetch('/api/init-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus('initialized');
        setMessage(data.message);
        setDetails(data.details);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to initialize database');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to initialize database');
      console.error('Database initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-6 h-6 animate-spin text-blue-500" />;
      case 'initialized':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'not-initialized':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Database className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'initialized':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'not-initialized':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Database Setup
          </h1>
          <p className="text-lg text-gray-600">
            Initialize your database to start using Analysis Compare
          </p>
        </div>

        {/* Status Card */}
        <div className={`rounded-lg border-2 p-6 mb-8 ${getStatusColor()}`}>
          <div className="flex items-center mb-4">
            {getStatusIcon()}
            <h2 className="text-xl font-medium ml-3">
              {status === 'checking' && 'Checking Database Status...'}
              {status === 'initialized' && 'Database Ready'}
              {status === 'not-initialized' && 'Database Not Initialized'}
              {status === 'error' && 'Database Error'}
            </h2>
          </div>
          
          {message && (
            <p className="text-sm mb-4">{message}</p>
          )}

          {details && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Table Status:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CheckCircle className={`w-4 h-4 mr-2 ${details.reports ? 'text-green-500' : 'text-gray-400'}`} />
                  <span>Reports Table</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`w-4 h-4 mr-2 ${details.sourceStandard ? 'text-green-500' : 'text-gray-400'}`} />
                  <span>Source Standard Table</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {status === 'not-initialized' && (
            <button
              onClick={initializeDatabase}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Initializing Database...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5 mr-2" />
                  Initialize Database
                </>
              )}
            </button>
          )}

          {status === 'initialized' && (
            <div className="space-y-3">
              <button
                onClick={checkDatabaseStatus}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Database className="w-5 h-5 mr-2" />
                Refresh Status
              </button>
              <a
                href="/"
                className="block w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Go to Application
              </a>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={checkDatabaseStatus}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Database className="w-5 h-5 mr-2" />
                Retry Check
              </button>
              <button
                onClick={initializeDatabase}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5 mr-2" />
                    Try Initialize Anyway
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Database Initialization:</strong> This process creates the necessary tables 
              for storing reports and source standards.
            </p>
            <p>
              <strong>If you encounter errors:</strong> Make sure the database file has proper 
              write permissions and the application has access to the database directory.
            </p>
            <p>
              <strong>Manual Setup:</strong> You can also run the initialization script manually 
              using: <code className="bg-gray-100 px-2 py-1 rounded">node src/scripts/init-db.js</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
