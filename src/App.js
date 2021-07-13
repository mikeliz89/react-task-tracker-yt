import './App.css';
import { useState } from 'react'
import Header from './components/Header'
import Tasks from './components/Tasks';

function App() {
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

  //Delete Task
  const deleteTask = (id) => {
    console.log('delete', id)
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="container">
      <Header title="Miikan"></Header>
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask}/> : 'No Tasks To Show'}
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
