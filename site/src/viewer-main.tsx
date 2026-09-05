import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/newsreader/latin-400.css';
import Viewer from './Viewer';
import './styles.css';
import './viewer.css';

const theme = createTheme({ palette: { primary: { main: '#374a36' }, background: { default: '#f5f4ed' } }, typography: { fontFamily: '"DM Sans", sans-serif', button: { textTransform: 'none' } } });
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ThemeProvider theme={theme}><CssBaseline /><Viewer /></ThemeProvider></React.StrictMode>);
