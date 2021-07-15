import './App.css';
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tasks from './components/Tasks';
import AddTask from './components/AddTask'

function App() {

  //states
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

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

    //from json-server
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

  // Toggle Reminder
  const toggleReminder = (id) => {
    console.log('toggle reminder', id);
    setTasks(tasks.map((task) => task.id == id
    ? { ...task, reminder: !task.reminder }: task));
  }

  // Add Task
  const addTask = (task) => {
    console.log('add task')
    console.log(task)

    //generate id (for now)
    const id = Math.floor(Math.random() * 10000) + 1
    console.log(id)

    const newTask = { id, ...task }
    setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = (id) => {
    console.log('delete', id)
    setTasks(tasks.filter((task) => task.id !== id))
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
