import "../styles/normalize.css";
import "../styles/global.css";
import EditorState from "../context/editor/EditorState";
import AppState from "../context/app/AppState";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <AppState>
      <EditorState>
        <main>
          <Component {...pageProps} />
        </main>
        <style jsx>{``}</style>
      </EditorState>
    </AppState>
  );
}
