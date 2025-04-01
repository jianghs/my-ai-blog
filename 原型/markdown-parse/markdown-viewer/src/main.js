import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import hljs from 'highlight.js';
// import 'highlight.js/styles/atom-one-dark.css';
import "highlight.js/styles/monokai-sublime.css";

const app = createApp(App);

app.directive('highlight', {
  mounted(el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
      hljs.highlightElement(block);
    });
  },
  updated(el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
      hljs.highlightElement(block);
    });
  }
});

app.mount('#app');
