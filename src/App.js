import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Button from './components/Button'

import TaskLists from './components/TaskList/TaskLists';
import TaskListDetails from './components/TaskList/TaskListDetails';
import AddTaskList from './components/TaskList/AddTaskList';

import TaskDetails from './components/Task/TaskDetails';

import Recipes from './components/Recipe/Recipes';

import { db } from './firebase-config';
import { ref, onValue, push, child, remove } from "firebase/database";

function App() {

  //states
  const [showAddTaskList, setShowAddTaskList] = useState(false)
  const [taskLists, setTaskLists] = useState()

  //const taskListUrl = 'http://localhost:5000/tasklists'

  //load data
  useEffect(() => {
    const getTaskLists = async () => {
      await fetchTaskListsFromFireBase()
      /*
      const taskListsFromServer = await fetchTaskListsFromJsonServer()
      setTaskLists(taskListsFromServer)
      */
    }
    getTaskLists()
  }, [])

  //Fetch Task Lists
  /*
  const fetchTaskListsFromJsonServer = async () => {
    const res = await fetch(taskListUrl)
    const data = await res.json()
    return data
  }
  */

  const fetchTaskListsFromFireBase = async () => {
    const dbref = await ref(db, '/tasklists');
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const taskLists = [];
      for(let id in snap) {
        taskLists.push({id, ...snap[id]});
      }
      setTaskLists(taskLists)
    })
  }

  // Add Task List
  const addTaskList = async (taskList) => {

    //To json server
    /*
    const res = await fetch(taskListUrl,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(taskList)
    })
    const data = await res.json()
    setTaskLists([...taskLists, data])
    */

    //To firebase
    const dbref = ref(db, '/tasklists');
    push(dbref, taskList);
  }

  // Delete Task List
  const deleteTaskList = async (id) => {

    //From json server
    /*
    await fetch(`${taskListUrl}/${id}`,
      {
        method: 'DELETE'
      });
    setTaskLists(taskLists.filter((taskList) => taskList.id !== id))
    */

    //From firebase

    //delete tasks
    const dbrefTasks = ref(db, '/tasks/' + id);
    remove(dbrefTasks);

    //delete task list
    const dbref = child(ref(db, '/tasklists'), id)
    remove(dbref)
  }

  return (
    <Router>
      <div className="container">
        <Header title="Miikan Task Tracker" 
        onAddTaskList={() => setShowAddTaskList(!showAddTaskList)}
        showAdd={showAddTaskList}></Header>
        <Routes>
          <Route path='/' element={
            <>
            <Link to={`/recipes`}><Button text="Manage Recipes"></Button></Link>
            {showAddTaskList && <AddTaskList onAddTaskList={addTaskList} />}
            {taskLists != null && taskLists.length > 0 ? (
            <TaskLists
            taskLists={taskLists} 
            onDelete={deleteTaskList} 
              />
            ) : (
              'No Task Lists To Show'
            )}
            </>
          }
          />
          <Route path='/recipes' element={<Recipes />} />
          <Route path='/about' element={<About />} />
          <Route path='/task/:id/:tasklistid' element={<TaskDetails />} />
          <Route path='/tasklist/:id' element={<TaskListDetails />} />
        </Routes>
        <Footer />
      </div>  
    </Router>
    );
}

export default App;
