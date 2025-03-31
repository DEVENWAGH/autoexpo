import React from "react";

const Footer = () => {
  return (
    <footer className="p-6 mt-12 bg-card border-t">
      <div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8"
        suppressHydrationWarning
      >
        <div suppressHydrationWarning>{/* ...existing content... */}</div>
        <div suppressHydrationWarning>{/* ...existing content... */}</div>
        <div suppressHydrationWarning>{/* ...existing content... */}</div>
        <div suppressHydrationWarning>{/* ...existing content... */}</div>
      </div>
      <div
        className="text-center mt-8 pt-8 border-t border-gray-200 text-gray-600"
        suppressHydrationWarning
      >
        {/* ...existing content... */}
      </div>
    </footer>
  );
};

export default Footer;
