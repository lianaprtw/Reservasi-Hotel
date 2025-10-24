import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import BookingStep1 from "../pages/BookingStep1";
import BookingStep2 from "../pages/BookingStep2";
import BookingSuccess from "../pages/BookingSuccess";
import MyBookings from "../pages/MyBookings";
import RoomDetail from "../pages/RoomDetail";
import Rooms from "../pages/Rooms";
import MyAccount from "../pages/MyAccount";
import MyBooking from "../pages/MyBookings";
import BookingDetail from "../pages/BookingDetail";
import AdminDashboard from "../pages/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Saat pertama kali dibuka ("/"), langsung arah ke Register */}
      <Route path="/" element={<Navigate to="/register" replace />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/booking" element={<BookingStep1 />} />
      <Route path="/booking-step2" element={<BookingStep2 />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      {/* <Route path="/my-bookings" element={<MyBookings />} /> */}
      <Route path="/rooms/:id" element={<RoomDetail />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/my-account" element={<MyAccount />} />
      <Route path="/my-booking" element={<MyBooking />} />
      <Route path="/booking-detail/:id" element={<BookingDetail />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
