import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import ManageTaskLists from './components/TaskList/ManageTaskLists';
import TaskListDetails from './components/TaskList/TaskListDetails';
import TaskDetails from './components/Task/TaskDetails';
import ManageRecipes from './components/Recipe/ManageRecipes';
import PrivateRoute from "./components/PrivateRoute"
import Signup from './components/Signup';

import { AuthProvider } from "./contexts/AuthContext"

function App() {

  return (
    <div className="container">
      <Router>
          <AuthProvider>
          <Header title="Lifesaver App" />
          <Routes>
            <Route exact path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path='/about' element={<About />} />
            <Route path='/managerecipes' element={<PrivateRoute><ManageRecipes /></PrivateRoute>} />
            <Route path='/managetasklists' element={<PrivateRoute><ManageTaskLists /></PrivateRoute>} />
            <Route path='/task/:id/:tasklistid' element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
            <Route path='/tasklist/:id' element={<PrivateRoute><TaskListDetails /></PrivateRoute>} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>  
    );
}

export default App;
