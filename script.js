window.addEventListener("scroll", () => {
    const element = document.getElementById("h11");
    const scrollY = window.scrollY;

    // Move the element upward based on scroll position
    element.style.transform = `translateX(${-scrollY*0.5 }px)`;
    
});

window.addEventListener("scroll", () => {
    const element = document.getElementById("h22");
    const scrollY = window.scrollY;

    // Move the element upward based on scroll position
    element.style.transform = `translateX(${scrollY*0.5}px)`;
});

window.addEventListener("scroll", () => {
    const element = document.getElementById("h33");
    const scrollY = window.scrollY;

    // Move the element upward based on scroll position
    element.style.transform = `translateX(${-scrollY *0.5}px)`;
});

window.addEventListener("scroll", () => {
    const element = document.getElementById("hdimg");
    const scrollY = window.scrollY;

    // Move the element upward based on scroll position
    element.style.transform = `translateY(${scrollY*0.5}px)`;
});

window.addEventListener("scroll", () => {
const element = document.getElementById("h11");
const scrollY = window.scrollY;
element.style.filter = `blur(${scrollY * 0.009}px)`;
});

window.addEventListener("scroll", () => {
const element = document.getElementById("h22");
const scrollY = window.scrollY;
element.style.filter = `blur(${scrollY * 0.009}px)`;
});

window.addEventListener("scroll", () => {
const element = document.getElementById("h33");
const scrollY = window.scrollY;
element.style.filter = `blur(${scrollY * 0.009}px)`;
});

window.addEventListener("scroll", () => {
const element = document.getElementById("hdimg");
const scrollY = window.scrollY;
element.style.filter = `blur(${scrollY * 0.01}px)`;
});

window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    preloader.style.display = "none";
  });

  const chatInput = document.getElementById('chat-input');
  const chatOutput = document.getElementById('chat-output');
  const sendButton = document.getElementById('send-button');
  
  // Function to simulate typing animation
  function typeMessage(element, message, speed = 25) {
      let index = 0;
      function type() {
          if (index < message.length) {
              element.innerHTML += message.charAt(index);
              index++;
              setTimeout(type, speed);
          }
      }
      type();
  }
  
  // Function to send a message
  async function sendMessage() {
      const userMessage = chatInput.value.trim();
      if (!userMessage) return;
  
      // Append user message
      let userMsgElement = document.createElement("p");
      userMsgElement.style.cssText = "font-family: Arial, sans-serif; line-height: 1.5; color: #000000;";
      userMsgElement.innerHTML = `<strong>You:</strong> ${userMessage}`;
      chatOutput.appendChild(userMsgElement);
  
      chatInput.value = '';
  
      // Show typing indicator
      let botMsgElement = document.createElement("p");
      botMsgElement.style.cssText = "font-family: Arial, sans-serif; line-height: 1.5; color: #000000;";
      botMsgElement.innerHTML = `<strong>Bot:</strong> <span id="typing-indicator">...</span>`;
      chatOutput.appendChild(botMsgElement);
  
      chatOutput.scrollTop = chatOutput.scrollHeight; // Auto-scroll
  
      try {
          const response = await fetch('https://port-backend-46fw.onrender.com', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: userMessage }),
          });
  
          if (!response.ok) throw new Error('Error in server response');
  
          const data = await response.json();
  
          // Remove typing indicator and start typing animation
          botMsgElement.innerHTML = `<strong>Bot:</strong> `;
          typeMessage(botMsgElement, data.response);
      } catch (error) {
          botMsgElement.innerHTML = `<strong>Bot:</strong> Error communicating with server. Please try again later.`;
          console.error(error);
      }
  
      chatOutput.scrollTop = chatOutput.scrollHeight; // Auto-scroll
  }
  
  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default form submission
          sendMessage();
      }
  });
  
