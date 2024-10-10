"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './bookingDetail.css'; 

interface Booking {
  id: number;
  service: string;
  doctor_name: string;
  start_time: string;
  end_time: string;
  date: string;
}

const formatTime = (time: string | null): string => {
  if (!time) return "N/A"; 
  const [hour, minute] = time.split(':');
  const hourNumber = parseInt(hour, 10);
  const formattedHour = String(hourNumber % 12 || 12).padStart(2, '0'); 
  const period = hourNumber >= 12 ? 'PM' : 'AM';
  return `${formattedHour}:${minute} ${period}`;
};


const formatDate = (date: string | null): string => {
  if (!date) return "N/A"
  return date.split('T')[0]; 
};

const BookingDetail = () => {
  const router = useRouter();
  const { id } = useParams(); 
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return; 

    console.log('Booking ID:', id); 

    const fetchBooking = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/bookings/${id}`); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log('Fetched booking data:', data); 
        
        setBooking(data);
      } catch (error: any) {
        console.error('Error fetching booking:', error); 
        setError(error.message);
      }
    };

    fetchBooking();
  }, [id]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!booking) {
    return <p>Loading...</p>;
  }

  return (
    <div className="booking-detail-container">
      <h1>Booking Details</h1>
      <div className="booking-detail">
        <p><strong>Service:</strong> {booking.service}</p>
        <p><strong>Doctor:</strong> {booking.doctor_name}</p>
        <p><strong>Start Time:</strong> {formatTime(booking.start_time)}</p> 
        <p><strong>End Time:</strong> {formatTime(booking.end_time)}</p> 
        <p><strong>Date:</strong> {formatDate(booking.date)}</p> 
      </div>
      <button className="back-button" onClick={() => router.push('/')}>Back to Bookings</button>
    </div>
  );
};

export default BookingDetail;
