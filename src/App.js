//App
import './App.css';
//React icons: https://react-icons.github.io/react-icons/icons?name=fa
//react
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//Site
import Header from './components/Site/Header';
import Footer from './components/Site/Footer';
//About
import About from './components/About';
//Dashboard
import Dashboard from './components/Dashboard';
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
import CreateMovement from './components/Exercises/CreateMovement';
import ExerciseDetails from './components/Exercises/ExerciseDetails';
import ManageMovements from './components/Exercises/ManageMovements';
//Recipe
import ManageFoodItems from './components/Recipe/ManageFoodItems';
import ManageRecipes from './components/Recipe/ManageRecipes';
import RecipeDetails from './components/Recipe/RecipeDetails';
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
//Backpacking
import ManageBackPacking from './components/BackPacking/ManageBackPacking';
import ManageGear from './components/BackPacking/ManageGear';
//other components
import PrivateRoute from './components/PrivateRoute';
import Demo from './components/Demo';
//AuthProvider
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
import BandsSeenLive from './components/Music/BandsSeenLive';
//Games
import Games from './components/Games/Games';
//LinksList
import LinksList from './components/Links/LinksList';

//global icons (https://fontawesome.com/v5/docs/web/use-with/react)
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faCheckSquare, faCoffee, faUtensils, faGlassMartini, faWeight } from '@fortawesome/free-solid-svg-icons';
library.add(fab, faCheckSquare, faCoffee, faUtensils, faGlassMartini, faWeight);

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

  return (
    <Container>
      <Router>
        <AuthProvider>
          <Header title="Lifesaver App" />
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
            {/* Recipe */}
            {/* Drinks */}
            <Route path='/managedrinks' element={<PrivateRoute><ManageDrinks /></PrivateRoute>} />
            <Route path='/managedrinkingproducts' element={<PrivateRoute><ManageDrinkingProducts /></PrivateRoute>} />
            <Route path='/drink/:id' element={<PrivateRoute><DrinkDetails /></PrivateRoute>} />
            <Route path='/drinkingproduct/:id' element={<PrivateRoute><DrinkingProductDetails /></PrivateRoute>} />
            {/*Drinks */}
            {/* Exercises */}
            <Route path='/manageexercises' element={<PrivateRoute><ManageExercises /></PrivateRoute>} />
            <Route path='/createexercise' element={<PrivateRoute><CreateExercise /></PrivateRoute>} />
            <Route path='/exercise/:id' element={<PrivateRoute><ExerciseDetails /></PrivateRoute>} />
            <Route path='/managemovements' element={<PrivateRoute><ManageMovements /></PrivateRoute>} />
            <Route path='/createmovement' element={<PrivateRoute><CreateMovement /></PrivateRoute>} />
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
            {/* Backpacking */}
            {/* Car */}
            <Route path='/car' element={<PrivateRoute><Car /></PrivateRoute>} />
            {/* Car */}
            {/* Music */}
            <Route path='/managemusic' element={<PrivateRoute><ManageMusic /></PrivateRoute>} />
            <Route path='/bandsseenlive' element={<PrivateRoute><BandsSeenLive /></PrivateRoute>} />
            {/* Music */}
            {/* Games */}
            <Route path='/games' element={<PrivateRoute><Games /></PrivateRoute>} />
            {/* Games */}
            {/* Demo */}
            <Route path='/Demo' element={<PrivateRoute><Demo /></PrivateRoute>} />
            {/* Demo */}
            {/* Links */}
            <Route path='/linkslist' element={<PrivateRoute><LinksList /></PrivateRoute>} />
            {/* Links */}
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </Container>
  );
}

export default App;
