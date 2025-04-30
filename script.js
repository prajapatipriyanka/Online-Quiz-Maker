
    let user = null;
    let questions = [
      { question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correct: 2 },
      { question: "Which planet is known as the Red Planet?", options: ["Earth", "Venus", "Mars", "Jupiter"], correct: 2 },
      { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1 }
    ];
    let scores = [];
    let userAnswers = [];
    let timerInterval;
    let timerSeconds = 0;

    function login() {
      const uname = document.getElementById('username').value;
      const pwd = document.getElementById('password').value;
      if (uname && pwd) {
        user = uname;
        document.getElementById('app').classList.add('hidden');
        showPopup();
      } else {
        alert("Enter username and password.");
      }
    }

    function showPopup() {
      document.getElementById('success-popup').classList.remove('hidden');
    }

    function closePopup() {
      document.getElementById('success-popup').classList.add('hidden');
      showHome();
    }

    function logout() {
      user = null;
      showHome();
    }

    function showHome() {
      document.getElementById('home').classList.remove('hidden');
      document.getElementById('app').classList.add('hidden');
    }

    function showLogin() {
      document.getElementById('app').classList.remove('hidden');
      document.getElementById('home').classList.add('hidden');
      document.getElementById('login').classList.remove('hidden');
      document.getElementById('dashboard').classList.add('hidden');
    }

    function showQuizInstructions() {
      if (!user) return alert("Please login first.");
      hideAll();
      document.getElementById('app').classList.remove('hidden');
      document.getElementById('instruction-page').classList.remove('hidden');
    }

    function toggleStartButton() {
      document.getElementById('start-btn').disabled = !document.getElementById('agree').checked;
    }

    function startQuiz() {
      document.getElementById('instruction-page').classList.add('hidden');
      showQuizzes();
    }

    function showQuizForm() {
      if (!user) return alert("Please login first.");
      hideAll();
      document.getElementById('app').classList.remove('hidden');
      document.getElementById('quiz-form').classList.remove('hidden');
    }

    function showQuizzes() {
      const container = document.getElementById('quiz-questions');
      container.innerHTML = '<div id="timer" class="bg-blue-600 text-white px-3 py-2 rounded shadow mb-4 text-lg text-center"></div>';

      questions.forEach((q, i) => {
        const div = document.createElement('div');
        div.className = 'mb-6';
        div.innerHTML = `<p class="font-semibold mb-3">${i + 1}. ${q.question}</p>`;
        q.options.forEach((opt, j) => {
          div.innerHTML += `<button data-question="${i}" onclick="selectOption(${i}, ${j}, this)" class="option-label bg-white text-black px-3 py-2 rounded mb-1 shadow w-full text-left">${opt}</button>`;
        });
        container.appendChild(div);
      });

      document.getElementById('quiz-container').classList.remove('hidden');
      document.getElementById('submit-btn').classList.remove('hidden');
      startTimer();
    }

    function selectOption(qIndex, optIndex, button) {
      userAnswers[qIndex] = optIndex;
      const allButtons = document.querySelectorAll(`button[data-question="${qIndex}"]`);
      allButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
    }

    function submitQuestion() {
      const q = document.getElementById('question').value;
      const options = [1, 2, 3, 4].map(n => document.getElementById(`option${n}`).value);
      const correct = parseInt(document.getElementById('correct').value) - 1;
      if (q && options.every(o => o) && correct >= 0 && correct < 4) {
        questions.push({ question: q, options, correct });
        alert("Question added successfully!");
        document.getElementById('question').value = "";
        options.forEach((_, i) => document.getElementById(`option${i + 1}`).value = "");
        document.getElementById('correct').value = "";
      } else {
        alert("Please fill all fields correctly.");
      }
    }

    function submitQuiz() {
      clearInterval(timerInterval);
      questions.forEach((q, i) => {
        const buttons = document.querySelectorAll(`button[data-question="${i}"]`);
        buttons.forEach((btn, idx) => {
          btn.disabled = true;
          btn.classList.remove('selected');
          if (idx === q.correct) {
            btn.classList.add('correct');
          } else if (userAnswers[i] === idx) {
            btn.classList.add('incorrect');
          }
        });
      });

      let score = 0;
      questions.forEach((q, i) => {
        if (userAnswers[i] === q.correct) score++;
      });
      alert(`You scored ${score}/${questions.length}`);
      scores.push({ name: user, score });
    }

    function showLeaderboard() {
      if (!user) return alert("Please login first.");
      hideAll();
      const board = document.getElementById('leaderboard');
      board.innerHTML = `
        <h3 class="text-3xl font-bold mb-6 text-center text-blue-700">Leaderboard</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white text-black rounded-lg overflow-hidden shadow-md">
            <thead class="bg-blue-600 text-white">
              <tr>
                <th class="py-3 px-6 text-left">Rank</th>
                <th class="py-3 px-6 text-left">Username</th>
                <th class="py-3 px-6 text-left">Score</th>
              </tr>
            </thead>
            <tbody id="leaderboard-body" class="text-gray-700"></tbody>
          </table>
        </div>
      `;

      const tbody = board.querySelector('#leaderboard-body');
      scores.sort((a, b) => b.score - a.score);
      scores.forEach((s, index) => {
        const row = document.createElement('tr');
        row.className = index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200';
        row.innerHTML = `
          <td class="py-3 px-6">${index + 1}</td>
          <td class="py-3 px-6 font-medium">${s.name}</td>
          <td class="py-3 px-6">${s.score}/${questions.length}</td>
        `;
        tbody.appendChild(row);
      });

      board.classList.remove('hidden');
    }

    function hideAll() {
      ['quiz-form', 'quiz-container', 'instruction-page', 'submit-btn', 'score', 'leaderboard'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
      });
      document.getElementById('home').classList.add('hidden');
      document.getElementById('login').classList.add('hidden');
      document.getElementById('dashboard').classList.remove('hidden');
    }

    function startTimer() {
      clearInterval(timerInterval);
      timerSeconds = questions.length * 60;
      const timerEl = document.getElementById('timer');
      timerEl.classList.remove('hidden');
      updateTimerDisplay(timerSeconds);

      timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay(timerSeconds);

        if (timerSeconds <= 0) {
          clearInterval(timerInterval);
          alert("Time's up!");
          submitQuiz();
        }
      }, 1000);
    }

    function updateTimerDisplay(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      document.getElementById('timer').textContent = `Time Left: ${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
