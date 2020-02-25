MediaRecorder = require("audio-recorder-polyfill");
MediaRecorder.encoder = require("audio-recorder-polyfill/mpeg-encoder");
MediaRecorder.prototype.mimeType = "audio/mpeg";
