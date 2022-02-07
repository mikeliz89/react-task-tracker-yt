import {useState, useEffect} from 'react';
import { useParams, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Button from '../Button';
import AddTask from '../Task/AddTask';
import Tasks from '../Task/Tasks';

import { db } from '../../firebase-config';
import { set, ref, onValue } from "firebase/database";

function TaskListDetails() {

    const taskUrl = 'http://localhost:5000/tasks'
    const taskListUrl = 'http://localhost:5000/tasklists'

    //states
    const [loading, setLoading] = useState(true)
    const [taskList, setTaskList] = useState({})
    const [error, setError] = useState(null)
    const [showAddTask, setShowAddTask] = useState(false)
    const [tasks, setTasks] = useState([])

    const params = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation()

    //load data
    useEffect(() => {
      //https://dev.to/jexperton/how-to-fix-the-react-memory-leak-warning-d4i
      let cancel = false;

      //Task List
      const getTaskList = async () => {
        if(cancel) return;
        //await fetchTaskListFromFirebase()
        const taskListFromServer = await fetchTaskListFromJsonServer()
        setTaskList(taskListFromServer)
        setLoading(false)
      }
      getTaskList()

      //Tasks
      const getTasks = async () => {
          //await fetchTasksFromFirebase()
          const tasksFromServer = await fetchTasksFromJsonServer()
          setTasks(tasksFromServer)
        }
      getTasks()

      return () => { 
        cancel = true;
      }
    }, [])

  //Fetch Task List
  const fetchTaskListFromJsonServer = async () => {
    const res = await fetch(`${taskListUrl}/${params.id}`)
    const data = await res.json()
    if(res.status === 404) {
        navigate('/')
    }
    return data
  }

  const fetchTaskListFromFirebase = async () => {
    const dbref = await ref(db, '/tasklists/' + (params.id - 1));
    onValue(dbref, (snapshot) => {
      const data = snapshot.val();
      if(data === null) {
        navigate('/')
      }
      setTaskList(data)
      setLoading(false);
    })
  }

  //Fetch Tasks
  const fetchTasksFromJsonServer = async () => {
      const res = await fetch(taskUrl)
      const data = await res.json()
      return data
  }

  const fetchTasksFromFirebase = async () => {
      const dbref = await ref(db, '/tasks');
      onValue(dbref, (snapshot) => {
        const data = snapshot.val();
        setTasks(data);
      })
  }

  //Fetch Task
  const fetchTask = async (id) => {

    const res = await fetch(`${taskUrl}/${id}`)
    const data = await res.json()

    return data
  }

  // Add Task
  const addTask = async (task) => {
    //To json server
    const res = await fetch(taskUrl,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    const data = await res.json()
    
    //To firebase
    //TODO: Rakenna toimivaksi
    //const dbref = await ref(db, "tasks");
    //set(dbref, {description:"test", title: "test"});

    setTasks([...tasks, task])
  }

  // Delete Task
  const deleteTask = async (id) => {

    //delete from json server
    await fetch(`${taskUrl}/${id}`,
      {
        method: 'DELETE'
      });

    //delete from firebase
    //TODO: Rakenna

    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {

      //to json server
      const taskToToggle = await fetchTask(id)
      const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder}

      const res = await fetch(`${taskUrl}/${id}`,
          {
          method: 'PUT',
          headers: {
              'Content-type': 'application/json'
          },
          body: JSON.stringify(updatedTask)
          })

      const data = await res.json()

      //to firebase 
      //TODO: Rakenna

      setTasks(
          tasks.map((task) => 
          task.id == id ? { ...task, reminder: data.reminder}: task
          )
      );
  }

  return loading ? (
  <h3>Loading...</h3>
  ) : ( 
      <div>
      {/* <pre>{JSON.stringify(taskList)}</pre> */}
      <h3>{taskList.title}</h3>
      <p>{taskList.description}</p>
      <Button text='Go Back' onClick={() => navigate(-1) }/>
      <Button color={showAddTask ? 'red' : 'green'}
              text={showAddTask ? 'Close' : 'Add Task'}
              onClick={() => setShowAddTask(!showAddTask)}
               />
      {showAddTask && <AddTask onAddTask={addTask} />}
            {tasks != null && tasks.length > 0 ? (
            <Tasks
            tasks={tasks} 
            onDelete={deleteTask}
            onToggle={toggleReminder}
              />
            ) : (
              'No Tasks To Show'
            )}
  </div> 
  );
};

export default TaskListDetails;
