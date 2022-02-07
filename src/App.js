import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'

import TaskLists from './components/TaskList/TaskLists';
import TaskListDetails from './components/TaskList/TaskListDetails';
import AddTaskList from './components/TaskList/AddTaskList';

import TaskDetails from './components/Task/TaskDetails';

import { db } from './firebase-config';
import { ref, onValue } from "firebase/database";

function App() {

  //states
  const [showAddTaskList, setShowAddTaskList] = useState(false)
  const [taskLists, setTaskLists] = useState({"title": "", "id":0, "description": ""})

  const taskListUrl = 'http://localhost:5000/tasklists'

  //load data
  useEffect(() => {
    const getTaskLists = async () => {
      //await fetchTaskListsFromFireBase()
      const taskListsFromServer = await fetchTaskListsFromJsonServer()
      setTaskLists(taskListsFromServer)
    }
    getTaskLists()
  }, [])

  //Fetch Task Lists
  const fetchTaskListsFromJsonServer = async () => {
    const res = await fetch(taskListUrl)
    const data = await res.json()
    return data
  }

  const fetchTaskListsFromFireBase = async () => {
    const dbref = await ref(db, '/tasklists');
    onValue(dbref, (snapshot) => {
      const data = snapshot.val();

      //todo: jos palautuu null, lisää firebaseen tyhjä taskLists-taulukko?
      setTaskLists(data)
    })
  }

  // Add Task List
  const addTaskList = async (taskList) => {

    //To json server
    const res = await fetch(taskListUrl,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(taskList)
    })

    const data = await res.json()

    //To firebase
    //TODO: Rakenna
    setTaskLists([...taskLists, data])
  }

  // Delete Task List
  const deleteTaskList = async (id) => {

    //From json server
    await fetch(`${taskListUrl}/${id}`,
      {
        method: 'DELETE'
      });

    //From firebase
    //TODO: Rakenna

    setTaskLists(taskLists.filter((taskList) => taskList.id !== id))
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
            {/* <pre>{JSON.stringify(taskLists)}</pre> */}
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
          <Route path='/about' element={<About />} />
          <Route path='/task/:id' element={<TaskDetails />} />
          <Route path='/tasklist/:id' element={<TaskListDetails />} />
        </Routes>
        <Footer />
      </div>  
    </Router>
    );
}

export default App;
