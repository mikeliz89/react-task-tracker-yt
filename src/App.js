import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import BigButton from './components/BigButton'
import ManageTaskLists from './components/TaskList/ManageTaskLists';
import TaskListDetails from './components/TaskList/TaskListDetails';
import TaskDetails from './components/Task/TaskDetails';
import ManageRecipes from './components/Recipe/ManageRecipes';

import Signup from './components/Signup';

import { AuthProvider } from "./contexts/AuthContext"

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="container">
          {/* <Signup /> */}
          <Header title="Lifesaver" />
          <Routes>
            <Route path='/' element={
              <>
              <Link to={`/managerecipes`}><BigButton textcolor="white" color="#b37401" text="Manage Recipes" /></Link>
              <Link to={`/managetasklists`}><BigButton color="green" text="Manage Task Lists" /></Link>
{/*               <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link> */}
              </>
            }
            />
            <Route path='/managerecipes' element={<ManageRecipes />} />
            <Route path='/managetasklists' element={<ManageTaskLists />} />
            <Route path='/about' element={<About />} />
            <Route path='/task/:id/:tasklistid' element={<TaskDetails />} />
            <Route path='/tasklist/:id' element={<TaskListDetails />} />
          </Routes>
          <Footer />
        </div>  
      </Router>
    </AuthProvider>
    );
}

export default App;
