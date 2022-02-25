import {useState, useEffect} from 'react';
import { useParams, useNavigate /*, useLocation */ } from 'react-router-dom';
import Button from '../Button';
import AddTask from '../Task/AddTask';
import AddTaskList from '../TaskList/AddTaskList';
import Tasks from '../Task/Tasks';
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../firebase-config';
import { update, ref, onValue, push, child, remove, get } from "firebase/database";
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { FaListAlt} from 'react-icons/fa'
import GoBackButton from '../GoBackButton';

function TaskListDetails() {

    //const taskUrl = 'http://localhost:5000/tasks'
    //const taskListUrl = 'http://localhost:5000/tasklists'

    //states
    const [loading, setLoading] = useState(true)
    const [taskList, setTaskList] = useState({})
    //const [error, setError] = useState(null)
    const [showAddTask, setShowAddTask] = useState(false)
    const [showEditTaskList, setShowEditTaskList] = useState(false)
    const [tasks, setTasks] = useState()

    const params = useParams();
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    //const { pathname } = useLocation()

    //load data
    useEffect(() => {
      //https://dev.to/jexperton/how-to-fix-the-react-memory-leak-warning-d4i
      let cancel = false;

      //Task List
      const getTaskList = async () => {
        if(cancel) return;
        await fetchTaskListFromFirebase()
        /*
        const taskListFromServer = await fetchTaskListFromJsonServer()
        setTaskList(taskListFromServer)
        setLoading(false)
        */
      }
      getTaskList()

      //Tasks
      const getTasks = async () => {
          await fetchTasksFromFirebase()
          /*
          const tasksFromServer = await fetchTasksFromJsonServer()
          setTasks(tasksFromServer)
          */
        }
      getTasks()

      return () => { 
        cancel = true;
      }
    }, [])

  //Fetch Task List
  /*
  const fetchTaskListFromJsonServer = async () => {
    const res = await fetch(`${taskListUrl}/${params.id}`)
    const data = await res.json()
    if(res.status === 404) {
        navigate('/')
    }
    return data
  }
  */

  const fetchTaskListFromFirebase = async () => {
    const dbref = ref(db, '/tasklists/' + params.id);
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
  /* 
  const fetchTasksFromJsonServer = async () => {
      const res = await fetch(taskUrl)
      const data = await res.json()
      return data
  }
  */

  const fetchTasksFromFirebase = async () => {
      const dbref = await child(ref(db, '/tasks'), params.id);
      onValue(dbref, (snapshot) => {
        const snap = snapshot.val();
        const tasks = [];
        for(let id in snap) {
          tasks.push({id, ...snap[id]});
        }
        setTasks(tasks);
      })
  }

  //Fetch Task
  /*
  const fetchTaskFromJsonServer = async (id) => {
    const res = await fetch(`${taskUrl}/${id}`)
    const data = await res.json()
    return data
  }
  */

  // Add Task
  const addTask = async (taskListID, task) => {
    //To json server
    /*
    const res = await fetch(taskUrl,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    const data = await res.json()
    setTasks([...tasks, task])
    */

    //To firebase
    task["created"] = getCurrentDateAsJson()
    task["createdBy"] = currentUser.email;
    const dbref = child(ref(db, '/tasks'), taskListID);
    push(dbref, task);   
  }

  // Delete Task
  const deleteTask = async (taskListID, id) => {

    //delete from json server
    /*
    await fetch(`${taskUrl}/${id}`,
      {
        method: 'DELETE'
      });
    setTasks(tasks.filter((task) => task.id !== id))
    */

    //delete from firebase
    const dbref = ref(db, '/tasks/' + taskListID + "/" + id)
    remove(dbref)
  }

  // Toggle Reminder
  const toggleReminder = async (taskListID, id) => {

      //to json server
      /*
      const taskToToggle = await fetchTaskFromJsonServer(id)
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
      */

      //to firebase
      const dbref = ref(db, '/tasks/' + taskListID + '/' + id);
      get(dbref).then((snapshot) => {
        if (snapshot.exists()) {
          const updates = {};
          const oldReminder = snapshot.val()["reminder"];
          updates['/tasks/' + taskListID + '/' + id + '/reminder'] = !oldReminder;
          update(ref(db), updates);
        } else {
          console.log("No data available");
        }
      });
  }

  // Add Task List
  const addTaskList = async (taskList) => {
      var taskListID = params.id;
      //save edited task list to firebase
      const updates = {};
      taskList["modified"] = getCurrentDateAsJson()
      updates[`/tasklists/${taskListID}`] = taskList;
      update(ref(db), updates);
  }

  return loading ? (
  <h3>Loading...</h3>
  ) : ( 
      <div>
      {/* <pre>{JSON.stringify(taskList)}</pre> */}
      <h3><FaListAlt style={{color:'gray', cursor: 'pointer', marginBottom: '-3px' }} /> {taskList.title}</h3>
      <p>{taskList.description}</p>
      <div style={{ display: "flex" }}>
        <GoBackButton />
        <Button text={showEditTaskList ? 'Close' : 'Edit'} 
                color={showEditTaskList ? 'red' : 'orange'} 
                onClick={() => setShowEditTaskList(!showEditTaskList) }/>
        <Button color={showAddTask ? 'red' : 'green'}
                text={showAddTask ? 'Close' : 'Add Task'}
                onClick={() => setShowAddTask(!showAddTask)}
                />
      </div>
      {showEditTaskList && <AddTaskList onAddTaskList={addTaskList} taskListID={params.id}  /> }
      {showAddTask && <AddTask taskListID={params.id} onAddTask={addTask} />}
            {tasks != null && tasks.length > 0 ? (
            <Tasks
            taskListID={params.id}
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
