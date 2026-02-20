'use client';

import { useState, useEffect } from 'react';

const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
  'caramellatte',
  'abyss',
  'silk',
];

interface ThemeSwitcherProps {
  initialTheme: string;
  onThemeChange: (newTheme: string) => void;
}

export default function ThemeSwitcher({ initialTheme, onThemeChange }: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  useEffect(() => {
    setCurrentTheme(initialTheme);
  }, [initialTheme]);

  const handleChange = (newTheme: string) => {
    setCurrentTheme(newTheme);
    onThemeChange(newTheme); 
  };

  return (
    <div className="dropdown dropdown-end">
      <div className="btn btn-sm btn-outline gap-2 normal-case" tabIndex={0} role="button">
        🎨 <span className="hidden md:inline">Tema:</span> {currentTheme}
      </div>

      <ul tabIndex={0} className="dropdown-content bg-base-200 rounded-box z-[50] w-52 shadow-2xl max-h-80 overflow-y-auto mt-2 p-2">
        {themes.map((themeName) => (
          <li key={themeName}>
            <button className={`btn btn-sm btn-block btn-ghost justify-start capitalize ${currentTheme === themeName ? 'btn-active' : ''}`} onClick={() => handleChange(themeName)}>
              {themeName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
