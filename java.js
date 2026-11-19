/* ================= 5. VOICE AI (TTS & STT) ================= */
    let voiceEnabled = true;

    function toggleVoice() {
      voiceEnabled = !voiceEnabled;
      document.getElementById("voiceToggle").textContent = voiceEnabled ? "🔊" : "🔇";
      if (!voiceEnabled) window.speechSynthesis.cancel();
    }

    function speakText(htmlText) {
      if (!voiceEnabled || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();

      // إزالة وسوم HTML والروابط قبل النطق
      const cleanText = htmlText.replace(/<[^>]*>/g, " ").replace(/https?:\/\/\S+/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // كشف تلقائي إذا النص عربي أو إنجليزي
      const isArabic = /[\u0600-\u06FF]/.test(cleanText);
      utterance.lang = isArabic ? "ar-SA" : "en-US";
      utterance.rate = 1.02;
      window.speechSynthesis.speak(utterance);
    }

    function startVoiceInput() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("متصفحك لا يدعم الإدخال الصوتي، جرب Google Chrome أو Edge.");
        return;
      }

      const recognition = new SpeechRecognition();
      const micBtn = document.getElementById("micBtn");
      recognition.lang = "ar-JO"; // يدعم اللهجة الأردنية/العربية والإنجليزية
      recognition.interimResults = false;

      recognition.onstart = () => micBtn.classList.add("listening");
      recognition.onend = () => micBtn.classList.remove("listening");

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        sendMessage();
      };

      recognition.start();
    }

    function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;

      const userDiv = document.createElement("div");
      userDiv.className = "msg user";
      userDiv.textContent = text;
      chatMessages.appendChild(userDiv);
      chatInput.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;

      setTimeout(() => {
        const reply = getBotResponse(text);
        const botDiv = document.createElement("div");
        botDiv.className = "msg bot";
        botDiv.innerHTML = reply;
        chatMessages.appendChild(botDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        speakText(reply);
      }, 300);
    }