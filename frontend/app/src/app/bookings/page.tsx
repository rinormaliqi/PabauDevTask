"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './booking.css';

export default function Bookings() {
  const [form, setForm] = useState({
    service: '',
    doctor_name: '',
    start_time: '',
    end_time: '',
    date: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const availableDoctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams'];
  const availableServices = ['Consultation', 'Check-up', 'Surgery'];
  const availableTimes = [
    '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM',
    '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM',
    '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
    '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM',
  ];

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      validateTimeFormat(form.start_time);
      validateTimeFormat(form.end_time);

      const startTime24 = convertTo24HourFormat(form.start_time);
      const endTime24 = convertTo24HourFormat(form.end_time);

      const bookingData = {
        service: form.service,
        doctor_name: form.doctor_name,
        start_time: startTime24,
        end_time: endTime24,
        date: form.date,
      };

      const response = await axios.post('http://localhost:5001/api/bookings', bookingData);
      console.log('Booking created:', response.data);

      router.push('/');
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setErrorMessage(error.message);
    }
  };

  function validateTimeFormat(time: string) {
    const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9]) ?([AP]M)$/i;
    if (!timeRegex.test(time)) {
      throw new Error('Invalid time format. Please use "hh:mm AM/PM" format.');
    }
  }

  function convertTo24HourFormat(time: string): string {
    const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9]) ?([AP]M)$/i;
    const match = timeRegex.exec(time);

    if (!match) {
      throw new Error('Invalid time format. Please use "hh:mm AM/PM" format.');
    }

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3].toUpperCase();

    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  const filteredEndTimes = availableTimes.filter((time) => {
    if (!form.start_time) return true; 
    const startTime24 = convertTo24HourFormat(form.start_time);
    const endTime24 = convertTo24HourFormat(time);
    return endTime24 > startTime24; 
  });

  return (
    <div className='bookingPage'>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="service">Service:</label>
        <select
          id="service"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          required
        >
          <option value="">Select a Service</option>
          {availableServices.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>

        <label htmlFor="doctor_name">Doctor Name:</label>
        <select
          id="doctor_name"
          value={form.doctor_name}
          onChange={(e) => setForm({ ...form, doctor_name: e.target.value })}
          required
        >
          <option value="">Select a Doctor</option>
          {availableDoctors.map((doctor) => (
            <option key={doctor} value={doctor}>
              {doctor}
            </option>
          ))}
        </select>

        <label htmlFor="start_time">Start Time:</label>
        <select
          id="start_time"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          required
        >
          <option value="">Select Start Time</option>
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <label htmlFor="end_time">End Time:</label>
        <select
          id="end_time"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          required
        >
          <option value="">Select End Time</option>
          {filteredEndTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
