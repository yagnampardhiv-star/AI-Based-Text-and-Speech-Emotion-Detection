/* =========================
   TEXT CHARACTER COUNTER
========================= */

const textInput = document.getElementById("textInput");
const characterCount = document.getElementById("characterCount");

textInput.addEventListener("input", function () {

    const count = textInput.value.length;

    characterCount.textContent =
        count + (count === 1 ? " character" : " characters");

});


/* =========================
   EMOTION KEYWORDS
========================= */

const emotionKeywords = {

    happy: [
        "happy",
        "joy",
        "joyful",
        "excited",
        "love",
        "wonderful",
        "amazing",
        "great",
        "awesome",
        "glad",
        "good",
        "fantastic",
        "success",
        "celebrate",
        "smile"
    ],

    sad: [
        "sad",
        "unhappy",
        "cry",
        "crying",
        "lonely",
        "depressed",
        "hurt",
        "pain",
        "lost",
        "miss",
        "upset",
        "bad",
        "disappointed",
        "failure"
    ],

    angry: [
        "angry",
        "hate",
        "furious",
        "annoyed",
        "irritated",
        "mad",
        "rage",
        "stupid",
        "frustrated",
        "terrible"
    ],

    fear: [
        "fear",
        "afraid",
        "scared",
        "worried",
        "worry",
        "anxious",
        "danger",
        "nervous",
        "panic",
        "threat"
    ],

    surprise: [
        "surprise",
        "surprised",
        "unexpected",
        "wow",
        "suddenly",
        "unbelievable",
        "shocked",
        "shock"
    ]

};


/* =========================
   TEXT EMOTION ANALYSIS
========================= */

function analyzeText() {

    const text = textInput.value.trim().toLowerCase();

    const emotionElement =
        document.getElementById("textEmotion");

    const confidenceElement =
        document.getElementById("textConfidence");

    if (text === "") {

        emotionElement.textContent =
            "Please enter some text";

        confidenceElement.textContent =
            "--";

        return;
    }


    let scores = {

        happy: 0,
        sad: 0,
        angry: 0,
        fear: 0,
        surprise: 0

    };


    /* Check keywords */

    for (const emotion in emotionKeywords) {

        emotionKeywords[emotion].forEach(keyword => {

            if (text.includes(keyword)) {

                scores[emotion]++;

            }

        });

    }


    /* Find strongest emotion */

    let detectedEmotion = "neutral";

    let highestScore = 0;

    for (const emotion in scores) {

        if (scores[emotion] > highestScore) {

            highestScore = scores[emotion];

            detectedEmotion = emotion;

        }

    }


    let confidence;


    if (detectedEmotion === "neutral") {

        confidence = 72;

    } else {

        confidence = Math.min(
            95,
            65 + highestScore * 8
        );

    }


    const emotionNames = {

        happy: "😊 Happy",

        sad: "😢 Sad",

        angry: "😡 Angry",

        fear: "😨 Fear",

        surprise: "😮 Surprise",

        neutral: "😐 Neutral"

    };


    emotionElement.textContent =
        emotionNames[detectedEmotion];

    confidenceElement.textContent =
        confidence + "%";


    /* Small animation */

    const result =
        document.getElementById("textResult");

    result.style.transform = "scale(1.02)";

    setTimeout(() => {

        result.style.transform = "scale(1)";

    }, 200);

}


/* =========================
   SPEECH RECOGNITION
========================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition;

let isRecording = false;


if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;


    recognition.onstart = function () {

        isRecording = true;

        document.getElementById("speechStatus")
            .textContent = "Listening...";

        document.getElementById("recordButton")
            .textContent = "Stop Recording";

        document.getElementById("recordButton")
            .classList.add("recording");

        document.getElementById("microphone")
            .classList.add("recording");

    };


    recognition.onresult = function (event) {

        const transcript =
            event.results[0][0].transcript;

        document.getElementById("speechText")
            .textContent = transcript;


        analyzeSpeechEmotion(transcript);

    };


    recognition.onend = function () {

        isRecording = false;

        document.getElementById("speechStatus")
            .textContent = "Ready to Listen";

        document.getElementById("recordButton")
            .textContent = "Start Recording";

        document.getElementById("recordButton")
            .classList.remove("recording");

        document.getElementById("microphone")
            .classList.remove("recording");

    };


    recognition.onerror = function (event) {

        isRecording = false;

        document.getElementById("speechStatus")
            .textContent = "Microphone Error";

        document.getElementById("recordButton")
            .textContent = "Try Again";

        document.getElementById("recordButton")
            .classList.remove("recording");

        document.getElementById("microphone")
            .classList.remove("recording");

        console.log("Speech recognition error:", event.error);

    };

}


/* =========================
   START SPEECH
========================= */

function startSpeech() {

    if (!SpeechRecognition) {

        alert(
            "Speech recognition is not supported in this browser. Please use Google Chrome."
        );

        return;
    }


    if (isRecording) {

        recognition.stop();

        return;

    }


    recognition.start();

}


/* =========================
   SPEECH EMOTION ANALYSIS
========================= */

function analyzeSpeechEmotion(text) {

    const lowerText =
        text.toLowerCase();


    let scores = {

        happy: 0,
        sad: 0,
        angry: 0,
        fear: 0,
        surprise: 0

    };


    for (const emotion in emotionKeywords) {

        emotionKeywords[emotion].forEach(keyword => {

            if (lowerText.includes(keyword)) {

                scores[emotion]++;

            }

        });

    }


    let detectedEmotion = "neutral";

    let highestScore = 0;


    for (const emotion in scores) {

        if (scores[emotion] > highestScore) {

            highestScore = scores[emotion];

            detectedEmotion = emotion;

        }

    }


    let confidence;


    if (detectedEmotion === "neutral") {

        confidence = 70;

    } else {

        confidence =
            Math.min(
                94,
                65 + highestScore * 8
            );

    }


    const emotionNames = {

        happy: "😊 Happy",

        sad: "😢 Sad",

        angry: "😡 Angry",

        fear: "😨 Fear",

        surprise: "😮 Surprise",

        neutral: "😐 Neutral"

    };


    document.getElementById("speechEmotion")
        .textContent =
        emotionNames[detectedEmotion];


    document.getElementById("speechConfidence")
        .textContent =
        confidence + "%";

}


/* =========================
   SCROLL FUNCTION
========================= */

function scrollToAnalyzer() {

    document.getElementById("analyzer")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================
   LEARN MORE
========================= */

function showInfo() {

    document.getElementById("about")
        .scrollIntoView({
            behavior: "smooth"
        });

}