import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'

import TaskLists from './components/TaskLists';
import TaskListDetails from './components/TaskListDetails';
import AddTaskList from './components/AddTaskList';
import TaskDetails from './components/TaskDetails';

function App() {

  //states
  const [showAddTaskList, setShowAddTaskList] = useState(false)
  const [taskLists, setTaskLists] = useState({"title": "", "id":0, "description": ""})

  const taskListUrl = 'http://localhost:5000/tasklists'

  //load data
  useEffect(() => {
    const getTaskLists = async () => {
      const taskListsFromServer = await fetchTaskLists()
      setTaskLists(taskListsFromServer)
    }
    getTaskLists()
  }, [])

  //Fetch Task Lists
  const fetchTaskLists = async () => {
    const res = await fetch(taskListUrl)
    const data = await res.json()
    return data
  }

  //Fetch Task List
  const fetchTaskList = async (id) => {
    const res = await fetch(`${taskListUrl}/${id}`)
    const data = await res.json()
    return data
  }

  // Add Task List
  const addTaskList = async (taskList) => {

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
  }

  // Delete Task List
  const deleteTaskList = async (id) => {

    await fetch(`${taskListUrl}/${id}`,
      {
        method: 'DELETE'
      });

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
            {taskLists.length > 0 ? (
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
