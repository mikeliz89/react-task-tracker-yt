//ICONIT
//React icons: https://react-icons.github.io/react-icons/icons?name=fa (old link)
//Icons here: https://fontawesome.com/search?q=food&f=classic&s=solid&ic=free&o=r
//Icon usage instructions: https://fontawesome.com/v5/docs/web/use-with/react

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckSquare, faUtensils, faGlassMartini, faWeight, faArrowLeft, faCampground, faHandsWash, faHamburger, faPizzaSlice,
  faListAlt, faTimes, faArrowUp, faArrowDown, faArchive, faComments, faCocktail, faSignOutAlt, faStar, faBurn, faTShirt, faSearch,
  faExternalLinkAlt, faCar, faGasPump, faRunning, faWalking, faBiking, faShip, faChild, faDumbbell, faHammer, faChargingStation,
  faFish, faUserAlt, faHistory, faPlus, faMinus, faLemon, faCarrot, faHourglass, faHourglass1, faEdit, faPlusSquare, faWineBottle,
  faCopy, faShoePrints, faWater, faImages, faSync, faGear, faMusic, faLaptopCode, faGamepad, faFilm, faWrench, faUserNinja, faBlender, faBreadSlice, faSun, faBell, faEnvelope, faGlobe
} from '@fortawesome/free-solid-svg-icons';
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
import { COLORS, THEMES } from './utils/Constants';

library.add(faCheckSquare, faUtensils, faGlassMartini, faWeight, faArrowLeft, faCampground, faHandsWash, faHamburger, faPizzaSlice,
  faListAlt, faTimes, faArrowUp, faArrowDown, faArchive, faComments, faCocktail, faSignOutAlt, faStar, faBurn, faTShirt, faSearch,
  faExternalLinkAlt, faCar, faGasPump, faRunning, faWalking, faBiking, faShip, faChild, faDumbbell, faHammer, faChargingStation,
  faFish, faUserAlt, faHistory, faPlus, faMinus, faLemon, faCarrot, faHourglass, faHourglass1, faEdit, faPlusSquare, faWineBottle,
  faCopy, faShoePrints, faWater, faImages, faSync, faGear, faMusic, faLaptopCode, faGamepad, faFilm, faWrench, faUserNinja, faBlender, faBreadSlice, faSun, faBell, faEnvelope, faGlobe
);


//app
function App() {

  const { theme } = useTheme();

  const colorRootElement = () => {

    const rootElement = document.getElementById("root");
    const htmlElement = document.documentElement;

    if (theme === THEMES.DARK) {
      rootElement.style.backgroundColor = COLORS.BLACK;
      htmlElement.style.backgroundColor = COLORS.BLACK;
    } else if (theme === THEMES.LIGHT) {
      rootElement.style.backgroundColor = COLORS.WHITE;
      htmlElement.style.backgroundColor = COLORS.WHITE;
    } else if (theme === THEMES.COLORFUL) {
      rootElement.style.backgroundColor = '#dcff7a';
      htmlElement.style.backgroundColor = '#d6ff65';
    }
  }

  colorRootElement();

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



