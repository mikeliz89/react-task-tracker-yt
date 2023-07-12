//App
import './App.css';
//react
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//Site
import Header from './components/Site/Header';
import Footer from './components/Site/Footer';
//About
import About from './components/Site/About';
//Dashboard
import Dashboard from './components/Dashboard/Dashboard';
//Auth
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
//TaskListArchive
import ManageTaskListsArchive from './components/TaskListsArchive/ManageTaskListsArchive';
import ArchivedTaskListDetails from './components/TaskListsArchive/ArchivedTaskListDetails';
//TaskList
import ManageTaskLists from './components/TaskList/ManageTaskLists';
import TaskListDetails from './components/TaskList/TaskListDetails';
//Task
import TaskDetails from './components/Task/TaskDetails';
//Exercises
import ManageExercises from './components/Exercises/ManageExercises';
import CreateExercise from './components/Exercises/CreateExercise';
import AddMovement from './components/Exercises/AddMovement';
import ExerciseDetails from './components/Exercises/ExerciseDetails';
import ManageMovements from './components/Exercises/ManageMovements';
import MovementDetails from './components/Exercises/MovementDetails';
//Recipe
import ManageFoodItems from './components/Recipe/ManageFoodItems';
import ManageRecipes from './components/Recipe/ManageRecipes';
import RecipeDetails from './components/Recipe/RecipeDetails';
import ManageRecipeLists from './components/Recipe/ManageRecipeLists';
//BMICalculator
import BmiCalculator from './components/BmiCalculator/BmiCalculator';
import WeightHistory from './components/BmiCalculator/WeightHistory';
//MyProfile
import ManageMyProfile from './components/MyProfile/ManageMyProfile';
//Drinks
import ManageDrinks from './components/Drinks/ManageDrinks';
import DrinkDetails from './components/Drinks/DrinkDetails';
import DrinkingProductDetails from './components/Drinks/DrinkingProductDetails';
import ManageDrinkingProducts from './components/Drinks/ManageDrinkingProducts';
import ManageDrinkLists from './components/Drinks/ManageDrinkLists';
//Backpacking
import ManageBackPacking from './components/BackPacking/ManageBackPacking';
import ManageGear from './components/BackPacking/ManageGear';
import ManageBackPackingLists from './components/BackPacking/ManageBackPackingLists';
import GearDetails from './components/BackPacking/GearDetails';
import ManageGearMaintenance from './components/BackPacking/ManageGearMaintenance';
//other components
import PrivateRoute from './components/PrivateRoute';
import Demo from './components/Demo/Demo';
//Contexts
import { AuthProvider } from './contexts/AuthContext';
//Language
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { Languages } from './Languages';
import 'flag-icon-css/css/flag-icons.min.css';
//Bootstrap
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//Car
import Car from './components/Car/Car';
//Music
import ManageMusic from './components/Music/ManageMusic';
import ManageMusicLists from './components/Music/ManageMusicLists';
import BandsSeenLive from './components/Music/BandsSeenLive';
import MusicDetails from './components/Music/MusicDetails';
//Games
import Games from './components/Games/Games';
import ManageGameLists from './components/Games/ManageGameLists';
//Movies
import ManageMovies from './components/Movies/ManageMovies';
import ManageMovieLists from './components/Movies/ManageMovieLists';
import MovieDetails from './components/Movies/MovieDetails';
//LinksList
import LinksList from './components/Links/LinksList';
//Programming
import ManageProgramming from './components/Programming/ManageProgramming';
//ShoppingLists
import ManageShoppingLists from './components/ShoppingList/ManageShoppingLists';
import { useTheme } from './contexts/ThemeContext';
//Other lists
import Lists from './components/Lists/Lists';
import ManageLists from './components/Lists/ManageLists';
//People / person
import ManagePeople from './components/People/ManagePeople';
import PersonDetails from './components/People/PersonDetails';
//Constants
import * as Constants from './utils/Constants';

//ICONIT
//React icons: https://react-icons.github.io/react-icons/icons?name=fa
//Icon usage instructions: https://fontawesome.com/v5/docs/web/use-with/react
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckSquare, faUtensils, faGlassMartini, faWeight, faArrowLeft, faCampground, faHandsWash, faHamburger, faPizzaSlice,
  faListAlt, faTimes, faArrowUp, faArrowDown, faArchive, faComments, faCocktail, faSignOutAlt, faStar, faBurn, faTShirt,
  faExternalLinkAlt, faCar, faGasPump, faRunning, faWalking, faBiking, faShip, faChild, faDumbbell, faHammer, faChargingStation,
  faFish, faUserAlt, faHistory, faPlus, faLemon, faCarrot, faHourglass, faHourglass1, faEdit, faPlusSquare, faWineBottle,
  faCopy, faShoePrints, faWater, faImages, faSync, faGear, faMusic, faLaptopCode, faGamepad, faFilm, faWrench
} from '@fortawesome/free-solid-svg-icons';

library.add(faCheckSquare, faUtensils, faGlassMartini, faWeight, faArrowLeft, faCampground, faHandsWash, faHamburger, faPizzaSlice,
  faListAlt, faTimes, faArrowUp, faArrowDown, faArchive, faComments, faCocktail, faSignOutAlt, faStar, faBurn, faTShirt,
  faExternalLinkAlt, faCar, faGasPump, faRunning, faWalking, faBiking, faShip, faChild, faDumbbell, faHammer, faChargingStation,
  faFish, faUserAlt, faHistory, faPlus, faLemon, faCarrot, faHourglass, faHourglass1, faEdit, faPlusSquare, faWineBottle,
  faCopy, faShoePrints, faWater, faImages, faSync, faGear, faMusic, faLaptopCode, faGamepad, faFilm, faWrench
);

//languagization
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: [Languages.EN, Languages.FI],
    fallbackLng: Languages.FI,
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },
    react: { useSuspense: false },
  });

//app
function App() {

  const { theme } = useTheme();

  const colorRootElement = () => {

    const rootElement = document.getElementById("root");
    const htmlElement = document.documentElement;

    if (theme === Constants.THEME_DARK) {
      rootElement.style.backgroundColor = Constants.THEME_BLACK;
      htmlElement.style.backgroundColor = Constants.THEME_BLACK;
    } else if (theme === Constants.THEME_LIGHT) {
      rootElement.style.backgroundColor = Constants.THEME_WHITE;
      htmlElement.style.backgroundColor = Constants.THEME_WHITE;
    }
  }

  colorRootElement();

  return (
    <Container id={theme}>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route exact path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path='/about' element={<About />} />
            {/* Login */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            {/* Login */}
            {/* Recipe */}
            <Route path='/recipe/:id' element={<PrivateRoute><RecipeDetails /></PrivateRoute>} />
            <Route path='/managerecipes' element={<PrivateRoute><ManageRecipes /></PrivateRoute>} />
            <Route path='/managefooditems' element={<PrivateRoute><ManageFoodItems /></PrivateRoute>} />
            <Route path='/managerecipelists' element={<PrivateRoute><ManageRecipeLists /></PrivateRoute>} />
            {/* Recipe */}
            {/* Drinks */}
            <Route path='/managedrinks' element={<PrivateRoute><ManageDrinks /></PrivateRoute>} />
            <Route path='/managedrinkingproducts' element={<PrivateRoute><ManageDrinkingProducts /></PrivateRoute>} />
            <Route path='/drink/:id' element={<PrivateRoute><DrinkDetails /></PrivateRoute>} />
            <Route path='/drinkingproduct/:id' element={<PrivateRoute><DrinkingProductDetails /></PrivateRoute>} />
            <Route path='/managedrinklists' element={<PrivateRoute><ManageDrinkLists /></PrivateRoute>} />
            {/*Drinks */}
            {/* Exercises */}
            <Route path='/manageexercises' element={<PrivateRoute><ManageExercises /></PrivateRoute>} />
            <Route path='/createexercise' element={<PrivateRoute><CreateExercise /></PrivateRoute>} />
            <Route path='/exercise/:id' element={<PrivateRoute><ExerciseDetails /></PrivateRoute>} />
            <Route path='/managemovements' element={<PrivateRoute><ManageMovements /></PrivateRoute>} />
            <Route path='/addmovement' element={<PrivateRoute><AddMovement /></PrivateRoute>} />
            <Route path='/movement/:id' element={<PrivateRoute><MovementDetails /></PrivateRoute>} />
            {/* Exercises */}
            {/* BMI */}
            <Route path='/bmicalculator' element={<PrivateRoute><BmiCalculator /></PrivateRoute>} />
            <Route path='/weighthistory' element={<PrivateRoute><WeightHistory /></PrivateRoute>} />
            {/* BMI */}
            {/* TaskLists */}
            <Route path='/managetasklists' element={<PrivateRoute><ManageTaskLists /></PrivateRoute>} />
            <Route path='/task/:id/:tasklistid' element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
            <Route path='/tasklist/:id' element={<PrivateRoute><TaskListDetails /></PrivateRoute>} />
            <Route path='/tasklistarchive' element={<PrivateRoute><ManageTaskListsArchive /></PrivateRoute>} />
            <Route path='/tasklistarchive/:id' element={<PrivateRoute><ArchivedTaskListDetails /></PrivateRoute>} />
            {/* TaskLists */}
            {/* MyProfile */}
            <Route path='/managemyprofile' element={<PrivateRoute><ManageMyProfile /></PrivateRoute>} />
            {/* MyProfile */}
            {/* Backpacking */}
            <Route path='/managebackpacking' element={<PrivateRoute><ManageBackPacking /></PrivateRoute>} />
            <Route path='/managegear' element={<PrivateRoute><ManageGear /></PrivateRoute>} />
            <Route path='/managegearmaintenance' element={<PrivateRoute><ManageGearMaintenance /></PrivateRoute>} />
            <Route path='/managebackpackinglists' element={<PrivateRoute><ManageBackPackingLists /></PrivateRoute>} />
            <Route path='/gear/:id' element={<PrivateRoute><GearDetails /></PrivateRoute>} />
            {/* Backpacking */}
            {/* Car */}
            <Route path='/car' element={<PrivateRoute><Car /></PrivateRoute>} />
            {/* Car */}
            {/* Music */}
            <Route path='/managemusic' element={<PrivateRoute><ManageMusic /></PrivateRoute>} />
            <Route path='/bandsseenlive' element={<PrivateRoute><BandsSeenLive /></PrivateRoute>} />
            <Route path='/managemusiclists' element={<PrivateRoute><ManageMusicLists /></PrivateRoute>} />
            <Route path='/music/:id' element={<PrivateRoute><MusicDetails /></PrivateRoute>} />
            {/* Music */}
            {/* Games */}
            <Route path='/games' element={<PrivateRoute><Games /></PrivateRoute>} />
            <Route path='/managegamelists' element={<PrivateRoute><ManageGameLists /></PrivateRoute>} />
            {/* Games */}
            {/* Movies */}
            <Route path='/managemovies' element={<PrivateRoute><ManageMovies /></PrivateRoute>} />
            <Route path='/managemovielists' element={<PrivateRoute><ManageMovieLists /></PrivateRoute>} />
            <Route path='/movie/:id' element={<PrivateRoute><MovieDetails /></PrivateRoute>} />
            {/* Movies */}
            {/* Demo */}
            <Route path='/Demo' element={<PrivateRoute><Demo /></PrivateRoute>} />
            {/* Demo */}
            {/* Programming */}
            <Route path='/manageprogramming' element={<PrivateRoute><ManageProgramming /></PrivateRoute>} />
            {/* Programming */}
            {/* Other lists */}
            <Route path='/lists' element={<PrivateRoute><Lists /></PrivateRoute>} />
            <Route path='/managelists' element={<PrivateRoute><ManageLists /></PrivateRoute>} />
            {/* Other lists */}
            {/* Links */}
            <Route path='/linkslist' element={<PrivateRoute><LinksList /></PrivateRoute>} />
            {/* Links */}
            {/* People / person */}
            <Route path='/managepeople' element={<PrivateRoute><ManagePeople /></PrivateRoute>} />
            <Route path='/person/:id' element={<PrivateRoute><PersonDetails /></PrivateRoute>} />
            {/* People  / person */}
            {
              <Route path='/manageshoppinglists' element={<PrivateRoute><ManageShoppingLists /></PrivateRoute>} />
            }
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </Container>
  );
}

export default App;
