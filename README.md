# Code on tape

I built this to make it convenient to add audio annotation to a bit of source code.

My hope is that this can serve as a sort of first-pass documentation, or maybe an asynchronous form of pairing.

## How it's built

The "editor" is [Monaco](https://github.com/Microsoft/monaco-editor) with editing disabled.

For audio recording I'm using this [excellent `MediaRecorder` polyfill](https://github.com/ai/audio-recorder-polyfill). It's wild how different Chrome, Firefox, and Safari are from each other as far as built-in recording format support.

I'm using React with the [Next.js framework](https://nextjs.org). I haven't yet decided if I would be better off with a more "vanilla" React setup, because packaging Monaco was a real struggle.

For the backend I'm using [Now's serverless functions](https://zeit.co/docs/v2/serverless-functions/introduction). Specifically, a function for uploading to Digital Ocean Spaces that feels pretty clean to me.
