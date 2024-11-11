"use client";
import React, { useState, useRef, useEffect } from "react";

const CustomSelect = () => {
  const options = ["All", "Location", "Size", "Type", "Date", "All", "Location", "Size", "Type", "Date"];
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1); // Track currently focused item
  const [selectedOption, setSelectedOption] = useState(null); // Track selected item
  const dropdownRef = useRef(null); // Reference for closing dropdown when clicked outside
  const focusedOptionRef = useRef(null); // Reference for the focused item

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % options.length); // Move down
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + options.length) % options.length); // Move up
    } else if (e.key === "Enter") {
      if (focusedIndex >= 0) handleOptionSelect(options[focusedIndex]); // Select the focused item
    } else if (e.key === "Escape") {
      setIsOpen(false); // Close the dropdown on escape
    }
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  // Scroll focused option into view
  useEffect(() => {
    if (focusedOptionRef.current) {
      focusedOptionRef.current.scrollIntoView({
        block: "nearest", // Scroll to the nearest part of the option
        inline: "nearest",
      });
    }
  }, [focusedIndex]);

  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <button
        className="w-full px-4 py-2 border bg-white text-left focus:outline-none"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
      >
        {selectedOption || "Select an option"}
      </button>

      {isOpen && (
        <ul
          className="absolute left-0 right-0 border bg-white max-h-60 overflow-auto z-10"
          role="listbox"
        >
          {options.map((option, index) => (
            <li
              key={option}
              role="option"
              ref={focusedIndex === index ? focusedOptionRef : null} // Reference the currently focused option
              tabIndex={-1}
              className={`px-4 py-2 cursor-pointer ${
                focusedIndex === index ? "bg-blue-500 text-white" : ""
              }`}
              onMouseEnter={() => setFocusedIndex(index)}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
