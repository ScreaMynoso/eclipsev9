import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SettingsContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  sounds: boolean;
  setSounds: (value: boolean) => void;
  playSound: (type: "click" | "success" | "error") => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [darkMode, setDarkModeState] = useState(() => {
    const saved = localStorage.getItem("eclipse-dark-mode");
    return saved !== null ? saved === "true" : true; // Default to dark mode
  });

  const [notifications, setNotificationsState] = useState(() => {
    const saved = localStorage.getItem("eclipse-notifications");
    return saved !== null ? saved === "true" : true;
  });

  const [sounds, setSoundsState] = useState(() => {
    const saved = localStorage.getItem("eclipse-sounds");
    return saved !== null ? saved === "true" : true;
  });

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
    localStorage.setItem("eclipse-dark-mode", String(value));
  };

  const setNotifications = (value: boolean) => {
    setNotificationsState(value);
    localStorage.setItem("eclipse-notifications", String(value));
    
    // Request notification permission if enabling
    if (value && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const setSounds = (value: boolean) => {
    setSoundsState(value);
    localStorage.setItem("eclipse-sounds", String(value));
  };

  const playSound = (type: "click" | "success" | "error") => {
    if (!sounds) return;

    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case "click":
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
      case "success":
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => {
          oscillator.frequency.value = 659.25; // E5
        }, 100);
        setTimeout(() => {
          oscillator.frequency.value = 783.99; // G5
        }, 200);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case "error":
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        setDarkMode,
        notifications,
        setNotifications,
        sounds,
        setSounds,
        playSound,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
