let voices = [];

document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("text-input");
    const speakBtn = document.getElementById("speak-btn");
    const voiceSelect = document.getElementById("voice-select");
    const rate = document.getElementById("rate");
    const pitch = document.getElementById("pitch");
    const volume = document.getElementById("volume");
    const presets = document.querySelectorAll(".preset");
    const saveBtn = document.getElementById("save");
    const loadBtn = document.getElementById("load");
    const settingsPanel = document.getElementById("settings");

    // Expand/Collapse Settings Panel
    settingsPanel.addEventListener("click", () => {
        if (!settingsPanel.classList.contains("expanded")) {
            settingsPanel.classList.add("expanded");
        }
    });

    settingsPanel.addEventListener("dblclick", () => {
        settingsPanel.classList.remove("expanded");
    });

    // Load Voices
    function loadVoices() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = "";
        voices.forEach((voice, i) => {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    // Speak Function
    speakBtn.addEventListener("click", () => {
        const utterance = new SpeechSynthesisUtterance(textInput.value);
        const selectedVoice = voices[voiceSelect.value];
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = parseFloat(rate.value);
        utterance.pitch = parseFloat(pitch.value);
        utterance.volume = parseFloat(volume.value);
        speechSynthesis.speak(utterance);
    });

    // Apply Presets
    presets.forEach(btn => {
        btn.addEventListener("click", () => {
            rate.value = btn.dataset.rate;
            pitch.value = btn.dataset.pitch;
            volume.value = btn.dataset.volume;
        });
    });

    // Save & Load Preferences
    saveBtn.addEventListener("click", () => {
        const prefs = {
            rate: rate.value,
            pitch: pitch.value,
            volume: volume.value,
            voice: voiceSelect.value
        };
        localStorage.setItem("ttsPrefs", JSON.stringify(prefs));
        alert("Preferences saved!");
    });

    loadBtn.addEventListener("click", () => {
        const prefs = JSON.parse(localStorage.getItem("ttsPrefs"));
        if (prefs) {
            rate.value = prefs.rate;
            pitch.value = prefs.pitch;
            volume.value = prefs.volume;
            voiceSelect.value = prefs.voice;
            alert("Preferences loaded!");
        } else {
            alert("No preferences found!");
        }
    });
});