import './App.css';
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tasks from './components/Tasks';
import AddTask from './components/AddTask'

function App() {

  //states
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  const url = 'http://localhost:5000/tasks'

  //load data
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //Fetch Tasks
  const fetchTasks = async () => {

    const res = await fetch(url)
    const data = await res.json()

    return data
  }

  //Fetch Task
  const fetchTask = async (id) => {

    const res = await fetch(`${url}/${id}`)
    const data = await res.json()

    return data
  }

  // Add Task
  const addTask = async (task) => {

    const res = await fetch(url,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (id) => {

    await fetch(`${url}/${id}`,
      {
        method: 'DELETE'
      });

    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {

    const taskToToggle = await fetchTask(id)
    const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`${url}/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      })

    const data = await res.json()

    setTasks(
      tasks.map((task) => 
        task.id == id ? { ...task, reminder: data.reminder}: task
      )
    );
  }

  return (
    <div className="container">
      <Header title="Miikan" onAdd={() => setShowAddTask(!showAddTask)}
      showAdd={showAddTask}></Header>
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No Tasks To Show'}
    </div>
  );
}

// import React from 'react'
// class App extends React.Component {
// render() {
//  return <h1>Hello from a class</h1>
// }
// }

export default App;
