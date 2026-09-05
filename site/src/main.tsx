import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/newsreader/latin-400.css';
import '@fontsource/newsreader/latin-400-italic.css';
import App from './App';
import './styles.css';

const theme = createTheme({
  palette: {
    primary: { main: '#374a36' },
    secondary: { main: '#ae4b2e' },
    background: { default: '#f5f4ed', paper: '#faf9f4' },
    text: { primary: '#242c25', secondary: '#666b60' },
    divider: '#d8d9ce',
  },
  typography: { fontFamily: '"DM Sans", sans-serif', button: { textTransform: 'none', fontWeight: 500 } },
  shape: { borderRadius: 6 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { padding: '10px 18px' } } },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', minWidth: 0, fontWeight: 500 } } },
    MuiChip: { styleOverrides: { root: { fontSize: '0.7rem', borderRadius: 4 } } },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><ThemeProvider theme={theme}><CssBaseline /><App /></ThemeProvider></React.StrictMode>,
);
