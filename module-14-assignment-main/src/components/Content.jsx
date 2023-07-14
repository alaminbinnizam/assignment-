import React, { useState } from "react";

export default function Content() {
  const [message, setMessage] = useState("");

  const handleClick = () => {
    // Get the text from the textarea
    const text = document.getElementById("text").value;

    // If the text is empty, show an error alert
    if (text === "") {
      alert("Please enter a message");
    } else {
      // Set the message in the p tag
      setMessage(text);
    }
  };

  return (
    <main>
      <div className="container">
        <button className="btn" onClick={handleClick}>
          Show Text
        </button>
        <textarea
          name="text"
          id="text"
          placeholder="Write your text here...."
        ></textarea>
        <p id="showMessage">{message}</p>
      </div>
    </main>
  );
}
