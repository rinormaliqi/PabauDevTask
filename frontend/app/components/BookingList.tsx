"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import "./bookingList.css";
import { CiTimer } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { MdOutlinePlace } from "react-icons/md";




interface Booking {
  id: number; 
  date: string;
  start_time: string;
  end_time: string;
  room?: number; 
}

//  function to format time 
const formatTime = (time: string | null): string => {
  if (!time) return "N/A"; 
  const [hour, minute] = time.split(':');
  const hourNumber = parseInt(hour, 10); 
  const formattedHour = String(hourNumber % 12 || 12).padStart(2, '0');
  const period = hourNumber >= 12 ? 'PM' : 'AM';
  return `${formattedHour}:${minute} ${period}`;
};

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]); 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get<Booking[]>('http://localhost:5001/api/bookings'); 
        const updatedBookings = response.data.map(booking => {
          const bookingDate = booking.date ? booking.date.split('T')[0] : "N/A"; 

          
          const startTime = formatTime(booking.start_time);
          const endTime = formatTime(booking.end_time);

          return {
            ...booking,
            room: Math.floor(Math.random() * 300) + 100, 
            date: bookingDate,
            start_time: startTime,
            end_time: endTime 
          };
        });
        setBookings(updatedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="booking-container">
      <div className='flex flex-row mb-4 justify-between items-center divclass1'>
      <h1>Bookings List</h1>
     <Link href="/bookings" className="text-white p-4 font-extrabold bg-green-600 rounded-lg hover:bg-green-700 hover:text-white buttonBookings">
    New Booking
     </Link>
     </div>
       <table className="booking-table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody >
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <Link href={`/bookings/${booking.id}`}>
                  {booking.room}<MdOutlinePlace />

                </Link>
              </td>
              <td >{booking.date} <CiCalendar /></td>
              <td >{booking.start_time} - {booking.end_time} <CiTimer /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
