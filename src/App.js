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

import Signup from './components/Signup';

import { AuthProvider } from "./contexts/AuthContext"

function App() {

  return (
    <div className="container">
      <Router>
          <AuthProvider>
          <Header title="Lifesaver" />
          <Routes>
            <Route exact path='/' element={<Dashboard />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path='/managerecipes' element={<ManageRecipes />} />
            <Route path='/managetasklists' element={<ManageTaskLists />} />
            <Route path='/about' element={<About />} />
            <Route path='/task/:id/:tasklistid' element={<TaskDetails />} />
            <Route path='/tasklist/:id' element={<TaskListDetails />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>  
    );
}

export default App;
