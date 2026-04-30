//ICONIT
//React icons: https://react-icons.github.io/react-icons/icons?name=fa (old link)
//Icons here: https://fontawesome.com/search?q=food&f=classic&s=solid&ic=free&o=r
//Icon usage instructions: https://fontawesome.com/v5/docs/web/use-with/react

import './icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'flag-icon-css/css/flag-icons.min.css';
import './i18n';
import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

import './App.css';

import Footer from './components/Site/Footer';
import Header from './components/Site/Header';
import { AuthProvider } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { colorRootElement } from './utils/colorRootElement';

//app
function App() {

  const { theme } = useTheme();
  colorRootElement(theme);

  return (
    <Container id={theme}>
      <Router>
        <AuthProvider>
          <Header />
          <AppRoutes />
          <Footer />
        </AuthProvider>
      </Router>
    </Container>
  );
}

export default App;



