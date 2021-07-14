import './App.css';
import { useState } from 'react'
import Header from './components/Header'
import Tasks from './components/Tasks';
import AddTask from './components/AddTask'

function App() {

  //states
  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks, setTasks] = useState([
    {
        id: 1,
        text: 'Irrota WC:n muovimatto',
        day: 'Jul 14th at 2:30pm',
        reminder: false
    },
    {
        id: 2,
        text: 'Palauta Audi Jonnelle',
        day: 'Jul 14th at 10:00am',
        reminder: true
    },
    {
        id: 3,
        text: 'Laita pyykkiä pyörimään koneeseen',
        day: 'Jul 13th at 8:01pm',
        reminder: false
    }
])

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
