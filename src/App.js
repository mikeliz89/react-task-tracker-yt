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
import RecordDetails from './components/Music/RecordDetails';
import BandDetails from './components/Music/BandDetails';
import EventDetails from './components/Music/EventDetails';
import ManageMusicBands from './components/Music/ManageMusicBands';
import ManageMusicEvents from './components/Music/ManageMusicEvents';
import ManageMusicLists from './components/Music/ManageMusicLists';
import ManageMusicRecords from './components/Music/ManageMusicRecords';
//Games
import Games from './components/Games/Games';
import ManageGames from './components/Games/ManageGames';
import ManageGameLists from './components/Games/ManageGameLists';
import GameDetails from './components/Games/GameDetails';
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
import { NAVIGATION, THEMES } from './utils/Constants';

//ICONIT
//React icons: https://react-icons.github.io/react-icons/icons?name=fa (old link)
//Icons here: https://fontawesome.com/search?q=food&f=classic&s=solid&ic=free&o=r
//Icon usage instructions: https://fontawesome.com/v5/docs/web/use-with/react
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckSquare, faUtensils, faGlassMartini, faWeight, faArrowLeft, faCampground, faHandsWash, faHamburger, faPizzaSlice,
  faListAlt, faTimes, faArrowUp, faArrowDown, faArchive, faComments, faCocktail, faSignOutAlt, faStar, faBurn, faTShirt,
  faExternalLinkAlt, faCar, faGasPump, faRunning, faWalking, faBiking, faShip, faChild, faDumbbell, faHammer, faChargingStation,
  faFish, faUserAlt, faHistory, faPlus, faMinus, faLemon, faCarrot, faHourglass, faHourglass1, faEdit, faPlusSquare, faWineBottle,
  faCopy, faShoePrints, faWater, faImages, faSync, faGear, faMusic, faLaptopCode, faGamepad, faFilm, faWrench, faUserNinja, faBlender, faBreadSlice
} from '@fortawesome/free-solid-svg-icons';

library.add(faCheckSquare, faUtensils, faGlassMartini, faWeight, faArrowLeft, faCampground, faHandsWash, faHamburger, faPizzaSlice,
  faListAlt, faTimes, faArrowUp, faArrowDown, faArchive, faComments, faCocktail, faSignOutAlt, faStar, faBurn, faTShirt,
  faExternalLinkAlt, faCar, faGasPump, faRunning, faWalking, faBiking, faShip, faChild, faDumbbell, faHammer, faChargingStation,
  faFish, faUserAlt, faHistory, faPlus, faMinus, faLemon, faCarrot, faHourglass, faHourglass1, faEdit, faPlusSquare, faWineBottle,
  faCopy, faShoePrints, faWater, faImages, faSync, faGear, faMusic, faLaptopCode, faGamepad, faFilm, faWrench, faUserNinja, faBlender, faBreadSlice
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
      loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
    },
    ns: ["common", "dashboard", "tasklist", "translation"],
    defaultNS: "translation",
    react: { useSuspense: false },
  });

//app
function App() {

  const { theme } = useTheme();

  const colorRootElement = () => {

    const rootElement = document.getElementById("root");
    const htmlElement = document.documentElement;

    if (theme === THEMES.DARK) {
      rootElement.style.backgroundColor = THEMES.BLACK;
      htmlElement.style.backgroundColor = THEMES.BLACK;
    } else if (theme === THEMES.LIGHT) {
      rootElement.style.backgroundColor = THEMES.WHITE;
      htmlElement.style.backgroundColor = THEMES.WHITE;
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
            <Route path={NAVIGATION.ABOUT} element={<About />} />
            {/* Login */}
            <Route path={NAVIGATION.SIGNUP} element={<Signup />} />
            <Route path={NAVIGATION.LOGIN} element={<Login />} />
            <Route path={NAVIGATION.FORGOT_PASSWORD} element={<ForgotPassword />} />
            {/* Login */}
            {/* Recipe */}
            <Route path={NAVIGATION.MANAGE_RECIPES} element={<PrivateRoute><ManageRecipes /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_FOODITEMS} element={<PrivateRoute><ManageFoodItems /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_RECIPELISTS} element={<PrivateRoute><ManageRecipeLists /></PrivateRoute>} />
            <Route path={NAVIGATION.RECIPE + '/:id'} element={<PrivateRoute><RecipeDetails /></PrivateRoute>} />
            {/* Recipe */}
            {/* Drinks */}
            <Route path={NAVIGATION.MANAGE_DRINKS} element={<PrivateRoute><ManageDrinks /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_DRINKINPRODUCTS} element={<PrivateRoute><ManageDrinkingProducts /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_DRINKLISTS} element={<PrivateRoute><ManageDrinkLists /></PrivateRoute>} />
            <Route path={NAVIGATION.DRINK + '/:id'} element={<PrivateRoute><DrinkDetails /></PrivateRoute>} />
            <Route path={NAVIGATION.DRINKINGPRODUCT + '/:id'} element={<PrivateRoute><DrinkingProductDetails /></PrivateRoute>} />
            {/*Drinks */}
            {/* Exercises */}
            <Route path={NAVIGATION.MANAGE_EXERCISES} element={<PrivateRoute><ManageExercises /></PrivateRoute>} />
            <Route path={NAVIGATION.CREATE_EXERCISE} element={<PrivateRoute><CreateExercise /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_MOVEMENTS} element={<PrivateRoute><ManageMovements /></PrivateRoute>} />
            <Route path={NAVIGATION.ADD_MOVEMENT} element={<PrivateRoute><AddMovement /></PrivateRoute>} />
            <Route path={NAVIGATION.EXERCISE + '/:id'} element={<PrivateRoute><ExerciseDetails /></PrivateRoute>} />
            <Route path={NAVIGATION.MOVEMENT + '/:id'} element={<PrivateRoute><MovementDetails /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_EXERCISE_LISTS} element={<PrivateRoute><ManageExerciseLists /></PrivateRoute>} />
            {/* Exercises */}
            {/* BMI */}
            <Route path={NAVIGATION.BMICALCULATOR} element={<PrivateRoute><BmiCalculator /></PrivateRoute>} />
            <Route path={NAVIGATION.WEIGHTHISTORY} element={<PrivateRoute><WeightHistory /></PrivateRoute>} />
            {/* BMI */}
            {/* TaskLists */}
            <Route path={NAVIGATION.MANAGE_TASKLISTS} element={<PrivateRoute><ManageTaskLists /></PrivateRoute>} />
            <Route path={NAVIGATION.TASKLIST_ARCHIVE} element={<PrivateRoute><ManageTaskListsArchive /></PrivateRoute>} />
            <Route path='/task/:id/:tasklistid' element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
            <Route path={NAVIGATION.TASKLIST + '/:id'} element={<PrivateRoute><TaskListDetails /></PrivateRoute>} />
            <Route path={NAVIGATION.TASKLIST_ARCHIVE + '/:id'} element={<PrivateRoute><ArchivedTaskListDetails /></PrivateRoute>} />
            {/* TaskLists */}
            {/* MyProfile */}
            <Route path={NAVIGATION.MANAGE_MY_PROFILE} element={<PrivateRoute><ManageMyProfile /></PrivateRoute>} />
            {/* MyProfile */}
            {/* Backpacking */}
            <Route path={NAVIGATION.MANAGE_BACKPACKING} element={<PrivateRoute><ManageBackPacking /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_BACKPACKINGLISTS} element={<PrivateRoute><ManageBackPackingLists /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_GEAR} element={<PrivateRoute><ManageGear /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_GEAR_MAINTENANCE} element={<PrivateRoute><ManageGearMaintenance /></PrivateRoute>} />
            <Route path={NAVIGATION.GEAR + '/:id'} element={<PrivateRoute><GearDetails /></PrivateRoute>} />
            {/* Backpacking */}
            {/* Car */}
            <Route path={NAVIGATION.MANAGE_CARLISTS} element={<PrivateRoute><ManageCarLists /></PrivateRoute>} />
            <Route path={NAVIGATION.CAR} element={<PrivateRoute><Car /></PrivateRoute>} />
            {/* Car */}
            {/* Music */}
            <Route path={NAVIGATION.MANAGE_MUSIC_RECORDS} element={<PrivateRoute><ManageMusicRecords /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_MUSIC_BANDS} element={<PrivateRoute><ManageMusicBands /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_MUSIC_EVENTS} element={<PrivateRoute><ManageMusicEvents /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_MUSICLISTS} element={<PrivateRoute><ManageMusicLists /></PrivateRoute>} />
            <Route path={NAVIGATION.MUSIC_RECORD + '/:id'} element={<PrivateRoute><RecordDetails /></PrivateRoute>} />
            <Route path={NAVIGATION.MUSIC_EVENT + '/:id'} element={<PrivateRoute><EventDetails /></PrivateRoute>} />
            <Route path={NAVIGATION.MUSIC_BAND + '/:id'} element={<PrivateRoute><BandDetails /></PrivateRoute>} />
            {/* Music */}
            {/* Games */}
            <Route path={NAVIGATION.GAMES} element={<PrivateRoute><Games /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_GAMES} element={<PrivateRoute><ManageGames /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_GAMELISTS} element={<PrivateRoute><ManageGameLists /></PrivateRoute>} />
            <Route path={NAVIGATION.GAME + '/:id'} element={<PrivateRoute><GameDetails /></PrivateRoute>} />
            {/* Games */}
            {/* Disc Golf */}
            <Route path={NAVIGATION.MANAGE_DISC_GOLF} element={<PrivateRoute><ManageDiscGolf /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_DISC_GOLF_TRACKS} element={<PrivateRoute><ManageDiscGolfTracks /></PrivateRoute>} />
            <Route path={NAVIGATION.DISC_GOLF_CREATE_TRACK} element={<PrivateRoute><CreateTrack /></PrivateRoute>} />
            <Route path={NAVIGATION.DISC_GOLF_START_NEW_ROUND} element={<PrivateRoute><StartNewRound /></PrivateRoute>} />
            <Route path={NAVIGATION.DISC_GOLF_PLAY_ROUND} element={<PrivateRoute><PlayRound /></PrivateRoute>} />
            <Route path={NAVIGATION.DISC_GOLF_TRACK + '/:id'} element={<PrivateRoute><TrackDetails /></PrivateRoute>} />
            {/* Disc Golf */}
            {/* Movies */}
            <Route path={NAVIGATION.MANAGE_MOVIES} element={<PrivateRoute><ManageMovies /></PrivateRoute>} />
            <Route path={NAVIGATION.MANAGE_MOVIELISTS} element={<PrivateRoute><ManageMovieLists /></PrivateRoute>} />
            <Route path={NAVIGATION.MOVIE + '/:id'} element={<PrivateRoute><MovieDetails /></PrivateRoute>} />
            {/* Movies */}
            {/* Demo */}
            <Route path={NAVIGATION.DEMO} element={<PrivateRoute><Demo /></PrivateRoute>} />
            {/* Demo */}
            {/* Programming */}
            <Route path={NAVIGATION.MANAGE_PROGRAMMING} element={<PrivateRoute><ManageProgramming /></PrivateRoute>} />
            {/* Programming */}
            {/* Other lists */}
            <Route path={NAVIGATION.MANAGE_LISTS} element={<PrivateRoute><ManageLists /></PrivateRoute>} />
            {/* Other lists */}
            {/* Links */}
            <Route path={NAVIGATION.LINKSLIST} element={<PrivateRoute><LinksList /></PrivateRoute>} />
            {/* Links */}
            {/* People / person */}
            <Route path={NAVIGATION.MANAGE_PEOPLE} element={<PrivateRoute><ManagePeople /></PrivateRoute>} />
            <Route path={NAVIGATION.PERSON + '/:id'} element={<PrivateRoute><PersonDetails /></PrivateRoute>} />
            {/* People  / person */}
            {
              <Route path={NAVIGATION.MANAGE_SHOPPINGLISTS} element={<PrivateRoute><ManageShoppingLists /></PrivateRoute>} />
            }
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </Container>
  );
}

export default App;
