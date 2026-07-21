// ===================== GLOBAL STATE =====================
let userName = "";

// ===================== PAGE NAVIGATION =====================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

// ===================== START CHAT (LOGIN) =====================
function startChat() {
  const input = document.getElementById('userNameInput');
  const name = input.value.trim();

  if (name === "") {
    alert("Please enter your name to continue!");
    return;
  }

  userName = name;
  localStorage.setItem('sashaUserName', userName);

  showPage('chatPage');
  clearChat(false); // fresh chat without confirm popup
  sendWelcomeMessage(userName);
}

// ===================== SPECIAL WELCOME MESSAGES =====================
function sendWelcomeMessage(name) {
  let welcomeText = "";
  const lowerName = name.toLowerCase();

  if (lowerName === "manisha") {
    welcomeText = "🌸 hello mam Have a beautiful day, just like you 😊 I'm delighted to assist you how can i help you.";
  } else if (lowerName === "subbu") {
    welcomeText = "😎 Welcome back, Boss! VIP Mode Activated. 🚀";
  } else if (lowerName === "ramesh"){
    welcomeText = "kya haal chaal hai ramesh aate wali kaisi hai.";
  } else {
    welcomeText = `hello 😊 ${name}! dear i am your AI assistent how can i help you?`;
  }

  addMessage(welcomeText, 'bot');
}

// ===================== SEND MESSAGE =====================
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

async function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();

  if (text === "") return;

  addMessage(text, 'user');
  input.value = "";

  showTypingIndicator(true);

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, user: userName })
    });

    const data = await response.json();

    showTypingIndicator(false);
    addMessage(data.reply, 'bot');

  } catch (error) {
    showTypingIndicator(false);
    addMessage("⚠️ Oops! Something went wrong. Please try again.", 'bot');
    console.error("Error:", error);
  }
}

// ===================== ADD MESSAGE TO CHAT =====================
function addMessage(text, sender) {
  const chatMessages = document.getElementById('chatMessages');

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const avatar = sender === 'bot' ? '🧠' : '🙂';

  messageDiv.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div>
      <div class="msg-bubble">${escapeHtml(text)}</div>
      <span class="msg-time">${time}</span>
    </div>
  `;

  chatMessages.appendChild(messageDiv);

  // Auto scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Prevent basic HTML injection in messages
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===================== TYPING ANIMATION =====================
function showTypingIndicator(show) {
  const indicator = document.getElementById('typingIndicator');
  indicator.style.display = show ? 'flex' : 'none';

  if (show) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// ===================== CLEAR CHAT =====================
function clearChat(askConfirm = true) {
  if (askConfirm) {
    const confirmClear = confirm("Are you sure you want to clear the chat?");
    if (!confirmClear) return;
  }

  document.getElementById('chatMessages').innerHTML = "";
}

// ===================== DARK / LIGHT MODE TOGGLE =====================
function toggleTheme() {
  document.body.classList.toggle('light-mode');

  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('sashaTheme', isLight ? 'light' : 'dark');
}

// Load saved theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem('sashaTheme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
}

// ===================== LOGOUT =====================
function logout() {
  const confirmLogout = confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;

  userName = "";
  localStorage.removeItem('sashaUserName');
  document.getElementById('chatMessages').innerHTML = "";
  document.getElementById('userNameInput').value = "";

  showPage('landingPage');
}

// ===================== ON PAGE LOAD =====================
window.onload = function () {
  loadTheme();
  showPage('landingPage'); // Always start from landing page
};

// ===================== INFO MODAL (Home/About/Features) =====================
const modalData = {
  home: {
    title: "Welcome to Sasha AI",
    body: "Sasha AI is your intelligent conversation partner — ask anything, learn anything, powered by advanced AI models."
  },
  about: {
    title: "About Sasha AI",
    body: "Created by Shubham 🚀<br><br>Built with the help of AI — using Claude, Groq & GPT during development.<br><br>This project was built using Python (Flask) for the backend and HTML, CSS & JavaScript for the frontend."
  },
  features: {
    title: "Features",
    body: `
      <ul style="text-align:left; line-height:1.8; padding-left:20px;">
        <li>💬 Real-time conversation</li>
        <li>🧠 Context-aware smart replies</li>
        <li>🌙 Dark / Light mode</li>
        <li>🔒 Secure & private chats</li>
        <li>📱 Fully responsive design</li>
        <li>⚡ Fast AI-powered responses</li>
      </ul>
    `
  }
};

function showModal(type) {
  const data = modalData[type];
  document.getElementById('modalContent').innerHTML =
    `<h2>${data.title}</h2><p style="margin-top:12px; color:#ccc; line-height:1.6;">${data.body}</p>`;
  document.getElementById('infoModal').classList.add('active');
}

function closeModal() {
  document.getElementById('infoModal').classList.remove('active');
}