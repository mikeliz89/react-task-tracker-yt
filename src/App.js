import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import ManageTaskLists from './components/TaskList/ManageTaskLists';
import TaskListDetails from './components/TaskList/TaskListDetails';
import TaskDetails from './components/Task/TaskDetails';
import ManageRecipes from './components/Recipe/ManageRecipes';
import PrivateRoute from "./components/PrivateRoute"
import Signup from './components/Signup';
import React from 'react';
import { AuthProvider } from "./contexts/AuthContext"
import BmiCalculator from './components/BmiCalculator/BmiCalculator';
import 'flag-icon-css/css/flag-icons.min.css'

//Language
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import Dropdown from 'react-bootstrap/Dropdown'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en', 'fi'],
    fallbackLng: "en",
    detection: { 
      order: ['cookie', 'htmlTag', 'localStorage', 'subdomain'],
      caches: ['cookie'],
    },
    backend : {
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },
    react: { useSuspense: false },
  });

const languages = [
  {
    code: 'fi',
    name: 'Suomi',
    country_code: 'fi'
  }, 
  {
    code: 'en',
    name: 'English',
    country_code: 'gb'
  }
]

function App() {

  return (
    <div className="container">

    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Kieli
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {languages.map(({code, name, country_code}) => (
          <Dropdown.Item key={country_code}>
            <button 
            className="btn"
            type="button"
            id="languageDropDownBtn"
            onClick={() => i18n.changeLanguage(code)}
            >
            <span className={`flag-icon flag-icon-${country_code}`}></span>
            {name}
          </button>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>

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
          <Route path='/task/:id/:tasklistid' element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
          <Route path='/tasklist/:id' element={<PrivateRoute><TaskListDetails /></PrivateRoute>} />
          <Route path='/bmicalculator' element={<PrivateRoute><BmiCalculator /></PrivateRoute>} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  </div>  
  );
}

export default App;
