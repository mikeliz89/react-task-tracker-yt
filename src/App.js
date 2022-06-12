import React from 'react';
import './App.css';
import 'flag-icon-css/css/flag-icons.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Site/Header';
import Footer from './components/Site/Footer';
import About from './components/About';
import Dashboard from './components/Dashboard';
//Auth
import Signup from './components/Auth/Signup'
import Login from './components/Auth/Login'
import ForgotPassword from './components/Auth/ForgotPassword'
//TaskListArchive
import ManageTaskListsArchive from './components/TaskListsArchive/ManageTaskListsArchive'
import ArchivedTaskListDetails from './components/TaskListsArchive/ArchivedTaskListDetails'
//TaskList
import ManageTaskLists from './components/TaskList/ManageTaskLists'
import TaskListDetails from './components/TaskList/TaskListDetails'
//Task
import TaskDetails from './components/Task/TaskDetails'
//Exercises
import ManageExercises from './components/Exercises/ManageExercises'
//Recipe
import ManageRecipes from './components/Recipe/ManageRecipes';
import RecipeDetails from './components/Recipe/RecipeDetails';
//BMICalculator
import BmiCalculator from './components/BmiCalculator/BmiCalculator'
import WeightHistory from './components/BmiCalculator/WeightHistory'
//MyProfile
import ManageMyProfile from './components/MyProfile/ManageMyProfile';
//Drinks
import ManageDrinks from './components/Drinks/ManageDrinks'
import DrinkDetails from './components/Drinks/DrinkDetails';
import ManageDrinkingProducts from './components/Drinks/ManageDrinkingProducts';
//Backpacking
import ManageBackPacking from './components/BackPacking/ManageBackPacking'
//other components
import PrivateRoute from './components/PrivateRoute'
import Demo from './components/Demo';
//AuthProvider
import { AuthProvider } from './contexts/AuthContext'
//Language
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
//Bootstrap
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en', 'fi'],
    fallbackLng: "fi",
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },
    react: { useSuspense: false },
  });

function App() {

  return (
    <Container>
      <Router>
        <AuthProvider>
          <Header title="Lifesaver App" />
          <Routes>
            <Route exact path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/about' element={<About />} />
            {/* Recipe */}
            <Route path='/recipe/:id' element={<PrivateRoute><RecipeDetails /></PrivateRoute>} />
            <Route path='/managerecipes' element={<PrivateRoute><ManageRecipes /></PrivateRoute>} />
            {/* Recipe */}
            {/* Drinks */}
            <Route path='/managedrinks' element={<PrivateRoute><ManageDrinks /></PrivateRoute>} />
            <Route path='/managedrinkingproducts' element={<PrivateRoute><ManageDrinkingProducts /></PrivateRoute>} />
            <Route path='/drink/:id' element={<PrivateRoute><DrinkDetails /></PrivateRoute>} />
            {/*Drinks */}
            <Route path='/managetasklists' element={<PrivateRoute><ManageTaskLists /></PrivateRoute>} />
            <Route path='/manageexercises' element={<PrivateRoute><ManageExercises /></PrivateRoute>} />
            <Route path='/task/:id/:tasklistid' element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
            <Route path='/tasklist/:id' element={<PrivateRoute><TaskListDetails /></PrivateRoute>} />
            <Route path='/bmicalculator' element={<PrivateRoute><BmiCalculator /></PrivateRoute>} />
            <Route path='/tasklistarchive' element={<PrivateRoute><ManageTaskListsArchive /></PrivateRoute>} />
            <Route path='/tasklistarchive/:id' element={<PrivateRoute><ArchivedTaskListDetails /></PrivateRoute>} />
            <Route path='/weighthistory' element={<PrivateRoute><WeightHistory /></PrivateRoute>} />
            <Route path='/managemyprofile' element={<PrivateRoute><ManageMyProfile /></PrivateRoute>} />
            <Route path='/managebackpacking' element={<PrivateRoute><ManageBackPacking /></PrivateRoute>} />
            <Route path='/Demo' element={<PrivateRoute><Demo /></PrivateRoute>} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </Container>
  );
}

export default App;
