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
import ManageExerciseLists from './components/Exercises/ManageExerciseLists';
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
import ManageCarLists from './components/Car/ManageCarLists';
import Car from './components/Car/Car';
//Music
import BandDetails from './components/Music/BandDetails';
import EventDetails from './components/Music/EventDetails';
import ManageMusicBands from './components/Music/ManageMusicBands';
import ManageMusicEvents from './components/Music/ManageMusicEvents';
import ManageMusicLists from './components/Music/ManageMusicLists';
import ManageMusicRecords from './components/Music/ManageMusicRecords';
import MusicDetails from './components/Music/MusicDetails';
//Games
import Games from './components/Games/Games';
import ManageGames from './components/Games/ManageGames';
import ManageGameLists from './components/Games/ManageGameLists';
//Disc Golf
import ManageDiscGolf from './components/DiscGolf/ManageDiscGolf';
import ManageDiscGolfTracks from './components/DiscGolf/ManageDiscGolfTracks';
import CreateTrack from './components/DiscGolf/CreateTrack';
import StartNewRound from './components/DiscGolf/StartNewRound';
import PlayRound from './components/DiscGolf/PlayRound';
import TrackDetails from './components/DiscGolf/TrackDetails';
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
  faFish, faUserAlt, faHistory, faPlus, faMinus, faLemon, faCarrot, faHourglass, faHourglass1, faEdit, faPlusSquare, faWineBottle,
  faCopy, faShoePrints, faWater, faImages, faSync, faGear, faMusic, faLaptopCode, faGamepad, faFilm, faWrench
} from '@fortawesome/free-solid-svg-icons';

library.add(faCheckSquare, faUtensils, faGlassMartini, faWeight, faArrowLeft, faCampground, faHandsWash, faHamburger, faPizzaSlice,
  faListAlt, faTimes, faArrowUp, faArrowDown, faArchive, faComments, faCocktail, faSignOutAlt, faStar, faBurn, faTShirt,
  faExternalLinkAlt, faCar, faGasPump, faRunning, faWalking, faBiking, faShip, faChild, faDumbbell, faHammer, faChargingStation,
  faFish, faUserAlt, faHistory, faPlus, faMinus, faLemon, faCarrot, faHourglass, faHourglass1, faEdit, faPlusSquare, faWineBottle,
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
            <Route path={Constants.NAVIGATION_ABOUT} element={<About />} />
            {/* Login */}
            <Route path={Constants.NAVIGATION_SIGNUP} element={<Signup />} />
            <Route path={Constants.NAVIGATION_LOGIN} element={<Login />} />
            <Route path={Constants.NAVIGATION_FORGOT_PASSWORD} element={<ForgotPassword />} />
            {/* Login */}
            {/* Recipe */}
            <Route path={Constants.NAVIGATION_MANAGE_RECIPES} element={<PrivateRoute><ManageRecipes /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_FOODITEMS} element={<PrivateRoute><ManageFoodItems /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_RECIPELISTS} element={<PrivateRoute><ManageRecipeLists /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_RECIPE + '/:id'} element={<PrivateRoute><RecipeDetails /></PrivateRoute>} />
            {/* Recipe */}
            {/* Drinks */}
            <Route path={Constants.NAVIGATION_MANAGE_DRINKS} element={<PrivateRoute><ManageDrinks /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_DRINKINPRODUCTS} element={<PrivateRoute><ManageDrinkingProducts /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_DRINKLISTS} element={<PrivateRoute><ManageDrinkLists /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_DRINK + '/:id'} element={<PrivateRoute><DrinkDetails /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_DRINKINGPRODUCT + '/:id'} element={<PrivateRoute><DrinkingProductDetails /></PrivateRoute>} />
            {/*Drinks */}
            {/* Exercises */}
            <Route path={Constants.NAVIGATION_MANAGE_EXERCISES} element={<PrivateRoute><ManageExercises /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_CREATE_EXERCISE} element={<PrivateRoute><CreateExercise /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_MOVEMENTS} element={<PrivateRoute><ManageMovements /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_ADD_MOVEMENT} element={<PrivateRoute><AddMovement /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_EXERCISE + '/:id'} element={<PrivateRoute><ExerciseDetails /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MOVEMENT + '/:id'} element={<PrivateRoute><MovementDetails /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_EXERCISE_LISTS} element={<PrivateRoute><ManageExerciseLists /></PrivateRoute>} />
            {/* Exercises */}
            {/* BMI */}
            <Route path={Constants.NAVIGATION_BMICALCULATOR} element={<PrivateRoute><BmiCalculator /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_WEIGHTHISTORY} element={<PrivateRoute><WeightHistory /></PrivateRoute>} />
            {/* BMI */}
            {/* TaskLists */}
            <Route path={Constants.NAVIGATION_MANAGE_TASKLISTS} element={<PrivateRoute><ManageTaskLists /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_TASKLIST_ARCHIVE} element={<PrivateRoute><ManageTaskListsArchive /></PrivateRoute>} />
            <Route path='/task/:id/:tasklistid' element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_TASKLIST + '/:id'} element={<PrivateRoute><TaskListDetails /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_TASKLIST_ARCHIVE + '/:id'} element={<PrivateRoute><ArchivedTaskListDetails /></PrivateRoute>} />
            {/* TaskLists */}
            {/* MyProfile */}
            <Route path={Constants.NAVIGATION_MANAGE_MY_PROFILE} element={<PrivateRoute><ManageMyProfile /></PrivateRoute>} />
            {/* MyProfile */}
            {/* Backpacking */}
            <Route path={Constants.NAVIGATION_MANAGE_BACKPACKING} element={<PrivateRoute><ManageBackPacking /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_BACKPACKINGLISTS} element={<PrivateRoute><ManageBackPackingLists /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_GEAR} element={<PrivateRoute><ManageGear /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_GEAR_MAINTENANCE} element={<PrivateRoute><ManageGearMaintenance /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_GEAR + '/:id'} element={<PrivateRoute><GearDetails /></PrivateRoute>} />
            {/* Backpacking */}
            {/* Car */}
            <Route path={Constants.NAVIGATION_MANAGE_CARLISTS} element={<PrivateRoute><ManageCarLists /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_CAR} element={<PrivateRoute><Car /></PrivateRoute>} />
            {/* Car */}
            {/* Music */}
            <Route path={Constants.NAVIGATION_MANAGE_MUSIC_RECORDS} element={<PrivateRoute><ManageMusicRecords /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_MUSIC_BANDS} element={<PrivateRoute><ManageMusicBands /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_MUSIC_EVENTS} element={<PrivateRoute><ManageMusicEvents /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_MUSICLISTS} element={<PrivateRoute><ManageMusicLists /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MUSIC_RECORD + '/:id'} element={<PrivateRoute><MusicDetails /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MUSIC_EVENT + '/:id'} element={<PrivateRoute><EventDetails /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MUSIC_BAND + '/:id'} element={<PrivateRoute><BandDetails /></PrivateRoute>} />
            {/* Music */}
            {/* Games */}
            <Route path={Constants.NAVIGATION_GAMES} element={<PrivateRoute><Games /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_GAMES} element={<PrivateRoute><ManageGames /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_GAMELISTS} element={<PrivateRoute><ManageGameLists /></PrivateRoute>} />
            {/* Games */}
            {/* Disc Golf */}
            <Route path={Constants.NAVIGATION_MANAGE_DISC_GOLF} element={<PrivateRoute><ManageDiscGolf /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_DISC_GOLF_TRACKS} element={<PrivateRoute><ManageDiscGolfTracks /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_DISC_GOLF_CREATE_TRACK} element={<PrivateRoute><CreateTrack /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_DISC_GOLF_START_NEW_ROUND} element={<PrivateRoute><StartNewRound /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_DISC_GOLF_PLAY_ROUND} element={<PrivateRoute><PlayRound /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_DISC_GOLF_TRACK + '/:id'} element={<PrivateRoute><TrackDetails /></PrivateRoute>} />
            {/* Disc Golf */}
            {/* Movies */}
            <Route path={Constants.NAVIGATION_MANAGE_MOVIES} element={<PrivateRoute><ManageMovies /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MANAGE_MOVIELISTS} element={<PrivateRoute><ManageMovieLists /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_MOVIE + '/:id'} element={<PrivateRoute><MovieDetails /></PrivateRoute>} />
            {/* Movies */}
            {/* Demo */}
            <Route path={Constants.NAVIGATION_DEMO} element={<PrivateRoute><Demo /></PrivateRoute>} />
            {/* Demo */}
            {/* Programming */}
            <Route path={Constants.NAVIGATION_MANAGE_PROGRAMMING} element={<PrivateRoute><ManageProgramming /></PrivateRoute>} />
            {/* Programming */}
            {/* Other lists */}
            <Route path={Constants.NAVIGATION_MANAGE_LISTS} element={<PrivateRoute><ManageLists /></PrivateRoute>} />
            {/* Other lists */}
            {/* Links */}
            <Route path={Constants.NAVIGATION_LINKSLIST} element={<PrivateRoute><LinksList /></PrivateRoute>} />
            {/* Links */}
            {/* People / person */}
            <Route path={Constants.NAVIGATION_MANAGE_PEOPLE} element={<PrivateRoute><ManagePeople /></PrivateRoute>} />
            <Route path={Constants.NAVIGATION_PERSON + '/:id'} element={<PrivateRoute><PersonDetails /></PrivateRoute>} />
            {/* People  / person */}
            {
              <Route path={Constants.NAVIGATION_MANAGE_SHOPPINGLISTS} element={<PrivateRoute><ManageShoppingLists /></PrivateRoute>} />
            }
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </Container>
  );
}

export default App;
