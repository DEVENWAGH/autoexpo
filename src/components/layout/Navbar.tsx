import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Cars", href: "/cars" },
    { name: "Bikes", href: "/bikes" },
    { name: "Brands", href: "/brands" },
    { name: "Compare", href: "/compare" },
    { name: "News & Reviews", href: "/news-reviews" }, // Add this new link
  ];

  return (
    <nav>
      <ul>
        {navigationItems.map((item) => (
          <li key={item.name}>
            <Link to={item.href}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
