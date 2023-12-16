document.addEventListener('DOMContentLoaded', function () {
  var chatbotToggle = document.querySelector('.chatbot-button');
  var chatbot = document.getElementById('chatbot');
  var messagesContainer = document.getElementById('chatbot-messages');
  var inputField = document.getElementById('chat-input');

  chatbotToggle.addEventListener('click', function () {
    chatbot.style.display = chatbot.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('send-btn').addEventListener('click', function () {
    sendMessageFromInput();
  });

  inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendMessageFromInput();
    }
  });

  function sendMessageFromInput() {
    var message = inputField.value;
    if (message) {
      displayMessage(message, 'user');
      sendMessageToRasa(message);
      inputField.value = ''; // Clear the input field after sending
    }
  }

  // Add push-to-talk functionality
  let recognition = null;

  function startSpeechRecognition() {
    recognition = new webkitSpeechRecognition() || SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function (event) {
      const speechResult = event.results[0][0].transcript;
      inputField.value = speechResult;
      sendMessageFromInput();
    };

    recognition.onerror = function (event) {
      console.error('Speech recognition error:', event.error);
    };
  }

  function stopSpeechRecognition() {
    if (recognition) {
      recognition.stop();
    }
  }

  document.getElementById('voice-input-btn').addEventListener('mousedown', function () {
    startSpeechRecognition();
  });

  document.getElementById('voice-input-btn').addEventListener('mouseup', function () {
    stopSpeechRecognition();
  });

  document.getElementById('voice-input-btn').addEventListener('touchstart', function () {
    startSpeechRecognition();
  });

  document.getElementById('voice-input-btn').addEventListener('touchend', function () {
    stopSpeechRecognition();
  });

  function linkify(text) {
    // This regular expression finds Markdown link syntax.
    const markdownUrlRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    return text.replace(markdownUrlRegex, (match, linkText, url) => {
      return `<a href="${url}" target="_blank">${linkText}</a>`;
    });
  }
  
  
  function displayMessage(messageData, sender) {
    var messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'sender-message' : 'receiver-message');
  
    // Check if messageData is just a string, and if so, treat it as text.
    if (typeof messageData === 'string') {
      messageElement.innerHTML = linkify(messageData);
    } else {
      // If messageData is an object, check for text and image properties.
      if (messageData.text) {
        messageElement.innerHTML = linkify(messageData.text);
      }
  
      if (messageData.image) {
        var img = document.createElement('img');
        img.src = messageData.image;
        img.classList.add('message-image');
        messageElement.appendChild(img);
      }
      
      // Handle suggestions if they exist
      if (messageData.buttons) {
        var buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
    
        messageData.buttons.forEach(function(button) {
          var buttonElement = document.createElement('button');
          buttonElement.textContent = button.title;
          buttonElement.className = 'button';
          buttonElement.onclick = function() {
            sendMessageToRasa(button.payload);
          };
          buttonsContainer.appendChild(buttonElement);
        });
    
        messageElement.appendChild(buttonsContainer);
      } 
    }
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTypingAnimation() {
    var typingElement = document.createElement('div');
    typingElement.className = 'typing-animation';
    for (var i = 0; i < 3; i++) {
      var dot = document.createElement('div');
      dot.className = 'typing-dot';
      typingElement.appendChild(dot);
    }
    messagesContainer.appendChild(typingElement);
  }

  function removeTypingAnimation() {
    var typingElement = document.querySelector('.typing-animation');
    if (typingElement) {
      typingElement.remove();
    }
  }

  function sendMessageToRasa(message) {
    showTypingAnimation();

    fetch('http://64.227.142.116:5005/webhooks/rest/webhook ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: 'user',
        message: message,
      }),
    })
      .then(response => response.json())
      .then(data => {
        removeTypingAnimation();
        data.forEach((response) => {
          if (response.text) {
            var suggestions = response.quick_replies ? response.quick_replies.map(reply => ({
              title: reply.title,
              payload: reply.payload
            })) : null;

            displayMessage({ 
              text: response.text, 
              suggestions: suggestions
            }, 'bot');
          }

          if (response.image) {
            displayMessage({ image: response.image }, 'bot');
          }
        });
      })
      .catch(error => {
        removeTypingAnimation();
        console.error('Error:', error);
        displayMessage('Sorry, I am having trouble replying at the moment.', 'bot');
      });
  }
});