import React, { useState } from 'react';
import { bookResource } from '../api';

const BookingForm = ({ token, resourceId, onSuccess }) => {
  const [timeslot, setTimeslot] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    console.log('Booking resource with:', { resourceId, timeslot, token }); // 🛠 DEBUG
  
    try {
      const bookingData = { resourceId, timeslot };
      const response = await bookResource(bookingData, token);
      console.log('Booking Response:', response); // 🛠 DEBUG
  
      setMessage('✅ Booking successful!');
      setTimeslot('');
  
      setTimeout(() => {
        onSuccess(); // Close modal
      }, 1500);
  
    } catch (err) {
      console.error('Booking Error:', err); // 🛠 DEBUG
      setMessage('❌ Booking failed.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <form onSubmit={handleBooking} className="booking-form-container">
      <input
        type="text"
        value={resourceId}
        readOnly
        className="booking-form-input"
      />
      <input
        type="text"
        placeholder="Timeslot (e.g. 10:00 AM - 11:00 AM)"
        value={timeslot}
        onChange={(e) => setTimeslot(e.target.value)}
        required
        className="booking-form-input"
      />
      {message && (
        <div className={message.includes('❌') ? "booking-form-error" : "booking-form-message"}>
          {message}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="booking-form-button"
      >
        {loading ? 'Booking...' : 'Book Resource'}
      </button>
    </form>
  );
};

export default BookingForm;
