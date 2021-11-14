import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';

import AuthContextProvider from './context/AuthContext';

import App from './App';
import reportWebVitals from './reportWebVitals';

import { theme } from './theme';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />

        <App />
      </ThemeProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
