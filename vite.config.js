import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// A relative base keeps generated URLs valid on GitHub project Pages and local previews.
export default defineConfig({ base: './', plugins: [react()] });
