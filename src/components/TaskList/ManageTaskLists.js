import { useState, useEffect } from 'react'
import { db } from '../../firebase-config';
import { ref, onValue, push, child, remove } from "firebase/database";
import TaskListButton from '../../components/TaskList/TaskListButton';
import AddTaskList from '../../components/TaskList/AddTaskList';
import TaskLists from '../../components/TaskList/TaskLists';
import GoBackButton from '../GoBackButton'
import Button from '../Button'
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Row, ButtonGroup } from 'react-bootstrap'

export default function ManageTaskLists() {

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const { t } = useTranslation();

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
    const dbref = ref(db, '/tasklists');
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
    taskList["created"] = getCurrentDateAsJson();
    taskList["createdBy"] = currentUser.email;
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

  function gotoTaskListArchive() {
    navigate('/tasklistarchive')
  }

  return (
    <div>
      <Row>
        <ButtonGroup>
          <GoBackButton  />
          <TaskListButton 
            onShowAddTaskList={() => setShowAddTaskList(!showAddTaskList)}
            showAdd={showAddTaskList}>
          </TaskListButton>
          <Button text={t('button_goto_tasklist_archive')} color="#545454" onClick={() => gotoTaskListArchive()} />
        </ButtonGroup>
      </Row>
      <h3 className="page-title">{t('manage_tasklists_title')}</h3>
      {showAddTaskList && <AddTaskList onAddTaskList={addTaskList} />}
      <div className="page-content">
        {taskLists != null && taskLists.length > 0 ? (
          <TaskLists
          taskLists={taskLists} 
          onDelete={deleteTaskList} 
            />
          ) : (
            t('no_task_lists_to_show')
          )
        }
      </div>
    </div>
  )
}
