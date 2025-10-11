const supportMsg = document.getElementById('supportMsg');
const textEl = document.getElementById('text');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const resumeBtn = document.getElementById('resume');
const stopBtn = document.getElementById('stop');
const stateEl = document.getElementById('state');
const voiceSelect = document.getElementById('voiceSelect');
const rate = document.getElementById('rate');
const pitch = document.getElementById('pitch');
const volume = document.getElementById('volume');
const rateVal = document.getElementById('rateVal');
const pitchVal = document.getElementById('pitchVal');
const volumeVal = document.getElementById('volumeVal');
const samplesBtn = document.getElementById('samples');
const clearBtn = document.getElementById('clear');
const presets = document.querySelectorAll('.preset');
const quickVoicesEl = document.getElementById('quickVoices');
const savePrefsBtn = document.getElementById('savePrefs');
const loadPrefsBtn = document.getElementById('loadPrefs');

let synth = window.speechSynthesis;
let voices = [];

function updateSupport() {
    if (!('speechSynthesis' in window)) {
        supportMsg.textContent = '⚠ Browser not supported';
        playBtn.disabled = true;
    } else {
        supportMsg.textContent = 'Loading voices...';
    }
}
updateSupport();

function populateVoices() {
    voices = synth.getVoices().sort((a, b) => a.name.localeCompare(b.name));
    voiceSelect.innerHTML = '';
    voices.forEach((v, i) => {
        let opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${v.name} (${v.lang})${v.default?" *":""}`;
        voiceSelect.appendChild(opt);
    });
    quickVoicesEl.innerHTML = '';
    voices.slice(0, 4).forEach((v, i) => {
        let b = document.createElement('button');
        b.className = 'preset';
        b.textContent = v.name.split(' ')[0];
        b.onclick = () => voiceSelect.value = i;
        quickVoicesEl.appendChild(b);
    });
    supportMsg.textContent = `${voices.length} voices loaded`;
}
populateVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
}

function speak() {
    let txt = textEl.value.trim();
    if (!txt) { alert("Enter text!"); return; }
    stop();
    let u = new SpeechSynthesisUtterance(txt);
    let v = voices[voiceSelect.value];
    if (v) u.voice = v;
    u.rate = +rate.value;
    u.pitch = +pitch.value;
    u.volume = +volume.value;
    u.onstart = () => stateEl.textContent = "speaking";
    u.onend = () => stateEl.textContent = "idle";
    synth.speak(u);
}

function pause() {
    if (synth.speaking && !synth.paused) {
        synth.pause();
        stateEl.textContent = "paused";
    }
}

function resume() {
    if (synth.paused) {
        synth.resume();
        stateEl.textContent = "speaking";
    }
}

function stop() {
    if (synth.speaking || synth.paused) {
        synth.cancel();
        stateEl.textContent = "idle";
    }
}

playBtn.onclick = speak;
pauseBtn.onclick = pause;
resumeBtn.onclick = resume;
stopBtn.onclick = stop;

rate.oninput = () => rateVal.textContent = rate.value;
pitch.oninput = () => pitchVal.textContent = pitch.value;
volume.oninput = () => volumeVal.textContent = volume.value;

samplesBtn.onclick = () => {
    let samples = [
        "Hello! I'm your text-to-speech app.",
        "Have a wonderful day ahead.",
        "The quick brown fox jumps over the lazy dog."
    ];
    textEl.value = samples[Math.floor(Math.random() * samples.length)];
};
clearBtn.onclick = () => textEl.value = "";

presets.forEach(p => {
    p.onclick = () => {
        rate.value = p.dataset.rate;
        pitch.value = p.dataset.pitch;
        volume.value = p.dataset.volume;
        rateVal.textContent = rate.value;
        pitchVal.textContent = pitch.value;
        volumeVal.textContent = volume.value;
    }
});

savePrefsBtn.onclick = () => {
    let prefs = { voice: voiceSelect.value, rate: rate.value, pitch: pitch.value, volume: volume.value };
    localStorage.setItem("tts_prefs", JSON.stringify(prefs));
    alert("Preferences saved!");
};
loadPrefsBtn.onclick = () => {
    let prefs = JSON.parse(localStorage.getItem("tts_prefs") || "{}");
    if (prefs.voice) voiceSelect.value = prefs.voice;
    if (prefs.rate) rate.value = prefs.rate;
    if (prefs.pitch) pitch.value = prefs.pitch;
    if (prefs.volume) volume.value = prefs.volume;
    rateVal.textContent = rate.value;
    pitchVal.textContent = pitch.value;
    volumeVal.textContent = volume.value;
    alert("Preferences loaded!");
};

document.addEventListener('keydown', e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        speak();
    }
    if (e.key === "Escape") { stop(); }
});