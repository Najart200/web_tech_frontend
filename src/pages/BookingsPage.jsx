import React, { useEffect, useState } from "react";
import { fetchBookings } from "../api";

const BookingsPage = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings(token); // Use API function
        setBookings(data);
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      }
    };

    if (token) {
      loadBookings();
    } else {
      setError("Token is missing.");
    }
  }, [token]);

  return (
    <div className="bookings-page">
      <h2 className="bookings-title">Your Bookings</h2>

      {error && <div className="bookings-error">{error}</div>}

      {bookings.map((b) => (
        <div key={b.id} className="booking-card">
          <p><strong>Resource:</strong> {b.resource_id}</p>
          <p><strong>Slot:</strong> {b.timeslot}</p>
          <p><strong>Status:</strong> {b.status}</p>
        </div>
      ))}
    </div>
  );
};

export default BookingsPage;
