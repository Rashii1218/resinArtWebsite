import { createRoot } from 'react-dom/client'
import axios from 'axios'
import App from './App.tsx'
import './index.css'

// Configure axios to include credentials by default
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")!).render(<App />);
