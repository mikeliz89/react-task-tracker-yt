import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import ManageTaskLists from './components/TaskList/ManageTaskLists'
import ManageExercises from './components/Exercises/ManageExercises'
import TaskListDetails from './components/TaskList/TaskListDetails'
import TaskDetails from './components/Task/TaskDetails'
import ManageRecipes from './components/Recipe/ManageRecipes'
import PrivateRoute from './components/PrivateRoute'
import Signup from './components/Signup'
import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import BmiCalculator from './components/BmiCalculator/BmiCalculator'
import WeightHistory from './components/BmiCalculator/WeightHistory'
import 'flag-icon-css/css/flag-icons.min.css'
import ManageTaskListsArchive from './components/TaskListsArchive/ManageTaskListsArchive'
import ArchivedTaskListDetails from './components/TaskListsArchive/ArchivedTaskListDetails'
import ManageMyProfile from './components/MyProfile/ManageMyProfile';
import Demo from './components/Demo';
//Language
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
//Bootstrap
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecipeDetails from './components/Recipe/RecipeDetails';

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
    backend : {
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
          <Route path='/managerecipes' element={<PrivateRoute><ManageRecipes /></PrivateRoute>} />
          <Route path='/managetasklists' element={<PrivateRoute><ManageTaskLists /></PrivateRoute>} />
          <Route path='/manageexercises' element={<PrivateRoute><ManageExercises /></PrivateRoute>} />
          <Route path='/task/:id/:tasklistid' element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
          <Route path='/tasklist/:id' element={<PrivateRoute><TaskListDetails /></PrivateRoute>} />
          <Route path='/bmicalculator' element={<PrivateRoute><BmiCalculator /></PrivateRoute>} />
          <Route path='/tasklistarchive' element={<PrivateRoute><ManageTaskListsArchive /></PrivateRoute>} />
          <Route path='/recipe/:id' element={<PrivateRoute><RecipeDetails /></PrivateRoute>} />
          <Route path='/tasklistarchive/:id' element={<PrivateRoute><ArchivedTaskListDetails /></PrivateRoute>} />
          <Route path='/weighthistory' element={<PrivateRoute><WeightHistory /></PrivateRoute>} />
          <Route path='/managemyprofile' element={<PrivateRoute><ManageMyProfile /></PrivateRoute>} />
          <Route path='/Demo' element={<PrivateRoute><Demo /></PrivateRoute>} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  </Container>  
  );
}

export default App;
