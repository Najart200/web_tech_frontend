import React, { useState } from 'react';
import BookingForm from './BookingForm';

const ResourceList = ({ resources, token }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(null);

  const openBookingForm = (resourceId) => {
    setSelectedResourceId(resourceId);
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    setShowBookingForm(false);
    setSelectedResourceId(null);
  };

  return (
    <div className="resource-list-container">
      <div className="resource-grid">
        {resources.map((resource) => (
          <div key={resource.id} className="resource-card">
            <h3>{resource.name}</h3>
            <p className="resource-description">{resource.description}</p>
            <p className="resource-meta">Category: {resource.category}</p>
            <p className="resource-meta">Availability: {resource.availability}</p>
            <button onClick={() => openBookingForm(resource.id)} className="book-button">
              Book
            </button>
          </div>
        ))}
      </div>

      {showBookingForm && (
        <div className="booking-overlay">
          <div className="booking-modal">
            <button onClick={closeBookingForm} className="close-button">
              ✕
            </button>
            <h3>Book Resource</h3>
            <BookingForm
              token={token}
              resourceId={selectedResourceId}
              onSuccess={closeBookingForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceList;
