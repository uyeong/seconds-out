import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // 시스템 테마 변경 감지 및 자동 업데이트
  useEffect(() => {
    if (theme !== 'system') return;

    // 시스템 테마 변경 감지를 위한 미디어 쿼리
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 테마 변경 시 호출될 핸들러
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      root.classList.add(newTheme);
    };

    // 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

export default ThemeProvider;
// eslint-disable-next-line react-refresh/only-export-components
export { useTheme };
