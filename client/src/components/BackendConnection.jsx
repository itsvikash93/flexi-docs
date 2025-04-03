import React, { useState, useEffect } from "react";

const BackendConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("https://flexi-docs.onrender.com/");
        if (response.ok) {
          setIsConnected(true);
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000); // Hide after 5 seconds
        } else {
          setIsConnected(false);
          setShowNotification(true);
        }
      } catch (error) {
        setIsConnected(false);
        setShowNotification(true);
      }
    };

    checkConnection();
  }, []);

  if (!showNotification) return null;

  return (
    <div
      className={`fixed top-5 right-5 max-w-sm px-4 py-3 rounded shadow-lg z-50 ${
        isConnected
          ? "bg-green-100 text-green-800 border border-green-600"
          : "bg-yellow-100 text-yellow-800 border border-yellow-600"
      }`}
    >
      {isConnected ? (
        <span>
          ✅ <span className="font-bold">Backend is connected successfully!</span>
        </span>
      ) : (
        <span>
          🔄 <span className="font-bold">Trying to connect to backend...</span>
        </span>
      )}
    </div>
  );
};

export default BackendConnection;
