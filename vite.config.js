import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        login: path.resolve(__dirname, 'src/pages/login/SignIn.html'),
        member: path.resolve(__dirname, 'src/pages/login/SignUp.html'),
        details: path.resolve(__dirname, 'src/pages/details/DetailsPage.html'),
        write: path.resolve(__dirname, 'src/pages/write/WritingPage.html'),
      },
    },
  },
});
