/* script.js */
(function() {
    let currentQuestionIndex = 0;
    let currentLanguage = 'en';
    let hintTimeout = null;

    const correctAnswers = {
        en: [
            "keyboard", // Answer for question 1
            "towel", // Answer for question 2
            "e", // Answer for question 3 in English
            "echo", // Answer for question 4
            "breath", // Answer for question 5
            "tomorrow" // Answer for question 6
        ],
        es: [
            "teclado", // Respuesta para la pregunta 1
            "toalla", // Respuesta para la pregunta 2
            "a", // Respuesta para la pregunta 3 en español
            "eco", // Respuesta para la pregunta 4
            "aliento", // Respuesta para la pregunta 5
            "mañana" // Respuesta para la pregunta 6
        ]
    };

    const correctStepsForSeventhQuestion = [
        "take-goat",
        "cross",
        "leave-goat",
        "cross",
        "take-wolf",
        "cross",
        "leave-wolf",
        "take-goat",
        "cross",
        "leave-goat",
        "take-cabbage",
        "cross",
        "leave-cabbage",
        "cross",
        "take-goat",
        "cross",
    ];

    let seventhStepIndex = 0;

    window.selectLanguage = function(lang) {
        currentLanguage = lang;
        document.getElementById('language-selection').style.display = 'none';
        document.getElementById('content').style.display = 'block';

        const elementsToTranslate = document.querySelectorAll('[data-en]');
        elementsToTranslate.forEach(element => {
            element.textContent = element.getAttribute(`data-${lang}`);
        });

        const inputsToTranslate = document.querySelectorAll('.answer-input');
        inputsToTranslate.forEach(input => {
            input.placeholder = input.getAttribute(`data-placeholder-${lang}`);
        });

        showQuestion(currentQuestionIndex);
    }

    function showQuestion(index) {
        const questions = document.querySelectorAll('.question');
        questions.forEach((question, i) => {
            question.style.display = i === index ? 'block' : 'none';
        });
    }

    window.showNextQuestion = function() {
        const questions = document.querySelectorAll('.question');

        if (currentQuestionIndex > 0 && currentQuestionIndex !== 6) {
            const currentAnswer = document.querySelector(`#answer-${currentQuestionIndex - 1}`);
            if (currentAnswer) { 
                const correctAnswer = correctAnswers[currentLanguage][currentQuestionIndex - 1].toLowerCase();
                if (currentAnswer.value.trim().toLowerCase() !== correctAnswer) {
                    currentAnswer.classList.add('wrong-answer');
                    setTimeout(() => {
                        currentAnswer.classList.remove('wrong-answer');
                        resetToFirstQuestion();
                    }, 500);
                    return;
                }
            }
        }

        if (currentQuestionIndex < questions.length) {
            if (currentQuestionIndex > 0) {
                questions[currentQuestionIndex - 1].style.display = 'none';
            }
            questions[currentQuestionIndex].style.display = 'block';
            currentQuestionIndex++;
        } else {
            document.getElementById('hint').style.display = 'none';
            document.getElementById('next-button').style.display = 'none';
            showVictoryAnimation();
        }
    }

    function resetToFirstQuestion() {
        currentQuestionIndex = 0;
        showQuestion(currentQuestionIndex);
        seventhStepIndex = 0;
        document.querySelectorAll('.correct-answer').forEach(btn => btn.classList.remove('correct-answer'));
    }

    function showVictoryAnimation() {
        // Shake screen in green color with confetti effect
        const body = document.body;
        body.classList.add('victory-shake');
        setTimeout(() => {
            body.classList.remove('victory-shake');
            hideContentAndShowVictoryScreen();
        }, 1500);
    }

    function hideContentAndShowVictoryScreen() {
        document.getElementById('content').style.display = 'none'; // Hide question content
        const victoryScreen = document.getElementById('victory-screen');
        victoryScreen.style.display = 'block';

        // Save the winning status in local storage
        localStorage.setItem('gameWon', true);

        const hintParagraph = document.getElementById('hidden-hint');
        hintParagraph.style.display = 'none';

        victoryScreen.addEventListener('click', function() {
            // Clear any existing timeout to prevent multiple timers
            if (hintTimeout) {
                clearTimeout(hintTimeout);
            }

            // Show the hint clearly for 3 seconds and then fade out
            hintParagraph.style.display = 'block';
            hintParagraph.style.opacity = '1';

            hintTimeout = setTimeout(() => {
                let fadeOutDuration = 3; // 3 seconds fade out
                const fadeOutInterval = setInterval(() => {
                    fadeOutDuration--;
                    hintParagraph.style.opacity = (fadeOutDuration / 3).toString();
                    if (fadeOutDuration <= 0) {
                        clearInterval(fadeOutInterval);
                        hintParagraph.style.opacity = '0';
                        hintParagraph.style.display = 'none';
                    }
                }, 1000);
            }, 3000);
        });
    }

    function checkGameWon() {
        if (localStorage.getItem('gameWon')) {
            document.getElementById('language-selection').style.display = 'block';
            document.getElementById('content').style.display = 'none';
        }
    }

    // Check if the game was already won
    checkGameWon();

    // Directly assign the click handler
    document.getElementById('next-button').onclick = window.showNextQuestion;

    // Trigger next question on 'Enter' key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            window.showNextQuestion();
        }
    });

    // Logic for the 7th question (step-by-step multiple choice)
    const seventhOptions = document.querySelectorAll('#seventh-options button');
    seventhOptions.forEach(button => {
        button.addEventListener('click', function() {
            if (button.dataset.value === correctStepsForSeventhQuestion[seventhStepIndex]) {
                button.classList.add('correct-answer');
                setTimeout(() => {
                    button.classList.remove('correct-answer');
                }, 1000);
                seventhStepIndex++;
                if (seventhStepIndex === correctStepsForSeventhQuestion.length) {
                    // Trigger victory animation instead of alert
                    showVictoryAnimation();
                }
            } else {
                button.classList.add('wrong-answer');
                setTimeout(() => {
                    button.classList.remove('wrong-answer');
                    resetToFirstQuestion();
                }, 500);
            }
        });
    });
})();
