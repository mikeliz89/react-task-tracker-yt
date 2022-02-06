import {useState, useEffect} from 'react';
import { useParams, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Button from '../Button';
import AddTask from '../Task/AddTask';
import Tasks from '../Task/Tasks';

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
        //Task list
        const fetchTaskList = async () => {
            const res = await fetch(`${taskListUrl}/${params.id}`)
            const data = await res.json()

            if(res.status === 404) {
                navigate('/')
            }

            setTaskList(data)
            setLoading(false)
        }
        fetchTaskList()

        //Tasks
        const getTasks = async () => {
            const tasksFromServer = await fetchTasks()
            setTasks(tasksFromServer)
          }
        getTasks()
    }, [])

    //Fetch Tasks
    const fetchTasks = async () => {
        const res = await fetch(taskUrl)
        const data = await res.json()
        return data
    }

    //Fetch Task
  const fetchTask = async (id) => {

    const res = await fetch(`${taskUrl}/${id}`)
    const data = await res.json()

    return data
  }

  // Add Task
  const addTask = async (task) => {

    const res = await fetch(taskUrl,
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

    await fetch(`${taskUrl}/${id}`,
      {
        method: 'DELETE'
      });

    setTasks(tasks.filter((task) => task.id !== id))
  }

    // Toggle Reminder
    const toggleReminder = async (id) => {

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
            {tasks.length > 0 ? (
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
