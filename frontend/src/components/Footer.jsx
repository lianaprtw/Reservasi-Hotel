import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#9C6644] text-white py-10 px-20 grid grid-cols-3">
      <div>
        <h3 className="font-semibold mb-2">We are on</h3>
        <div className="flex space-x-4 text-xl">
          <i className="fa-brands fa-facebook"></i>
          <i className="fa-brands fa-instagram"></i>
          <i className="fa-brands fa-square-behance"></i>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Location</h3>
        <p>Sunset road No. 30, Kuta, Bali</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Contact Us</h3>
        <p>+875236258158</p>
        <p>puriindah@info.id</p>
      </div>

      <div className="col-span-3 text-center text-sm text-white mt-8">
        © Puri Indah Hotel 2025
      </div>
    </footer>
  );
};

export default Footer;
