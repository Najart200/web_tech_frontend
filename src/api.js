export const registerUser = async (userData) => {
    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        });

        const text = await res.text(); // always capture text
        console.log('Raw response:', text);

        try {
            const json = JSON.parse(text);
            if (!res.ok) throw new Error(json.error || 'Registration failed');
            return json;
        } catch (parseErr) {
            console.error('Invalid JSON from server:', text);
            throw new Error('Invalid JSON from server');
        }
    } catch (err) {
        console.error('registerUser error:', err.message);
        throw err;
    }
};


export const loginUser = async ({ email, password }) => {
    try {
        const res = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const text = await res.text();

        try {
            const data = JSON.parse(text);
            if (!res.ok) {
                return { error: data.message || 'Login failed.' };
            }
            return data;
        } catch (e) {
            console.error('Failed to parse JSON:', text);
            return { error: 'Invalid response from server.' };
        }

    } catch (err) {
        console.error('Network error:', err);
        return { error: 'Network error. Please try again.' };
    }
};


export const fetchResources = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/resources', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error fetching resources');
      }
  
      const data = await response.json();
      return data; // Make sure this is an array, for example: [{id, name, description, ...}]
    } catch (error) {
      console.error("Error fetching resources:", error);
      return []; // Return an empty array if the request fails
    }
  };
  

  export const bookResource = async (bookingData, token) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
  
      const text = await res.text(); // Always read as text first
      console.log('Raw response (bookResource):', text);
  
      try {
        const data = JSON.parse(text);
  
        if (!res.ok) {
          throw new Error(data.message || 'Booking failed');
        }
  
        return data; // Success response
  
      } catch (parseErr) {
        console.error('Invalid JSON from server:', text);
        throw new Error('Invalid JSON from server');
      }
  
    } catch (err) {
      console.error('bookResource error:', err.message);
      throw err; // Rethrow so the frontend form can catch it
    }
  };
  

  // In api.js
export const fetchBookings = async (token) => {
    try {
        const response = await fetch(`http://localhost:5000/api/bookings/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const text = await response.text();
        console.log('Raw response (fetchBookings):', text);

        try {
            const data = JSON.parse(text);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch bookings');
            }

            return data;

        } catch (parseErr) {
            console.error('Invalid JSON from server:', text);
            throw new Error('Invalid JSON response from server');
        }

    } catch (err) {
        console.error('fetchBookings error:', err.message);
        throw err;
    }
};
// In api.js

export const fetchAdminData = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const [usersRes, bookingsRes, resourcesRes] = await Promise.all([
    fetch('http://localhost:5000/api/admin/users', { headers }),
    fetch('http://localhost:5000/api/admin/bookings', { headers }),
    fetch('http://localhost:5000/api/resources', { headers }),  // normal users can fetch resources too
  ]);

  
  if (!usersRes.ok || !bookingsRes.ok || !resourcesRes.ok) {
    throw new Error('Failed to fetch admin data');
  }
  const users = await usersRes.json();
  const bookings = await bookingsRes.json();
  const resources = await resourcesRes.json();

  return { users, bookings, resources };
};



export async function deleteResource(id) {
  const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete resource');
}

export async function deleteBooking(id) {
  const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete booking');
}

export async function deleteUser(id) {
  const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
}

export async function updateResource(resource) {
  const res = await fetch(`/api/resources/${resource.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resource),
  });
  if (!res.ok) throw new Error('Failed to update resource');
}

export async function updateBooking(booking) {
  const res = await fetch(`/api/bookings/${booking.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });
  if (!res.ok) throw new Error('Failed to update booking');
}

export async function updateUser(user) {
  const res = await fetch(`/api/users/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to update user');
}

export async function addResource(resource) {
  const res = await fetch('/api/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resource),
  });
  if (!res.ok) throw new Error('Failed to add resource');
}
