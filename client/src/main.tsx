import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";

// Initialize theme from localStorage
const initializeTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Apply theme based on local storage or system preference
  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Call the function before rendering
initializeTheme();

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found!");
}

createRoot(root).render(
  <>
    <App />
    <Toaster />
  </>
);
