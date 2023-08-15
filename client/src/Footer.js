// components/Footer.js
import React from "react";
// import "./Footer.css"; // Import your styles if needed

function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} ScribbleSights. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
