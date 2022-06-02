//React
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Row, ButtonGroup } from 'react-bootstrap'
//Firebase
import { db } from '../../firebase-config';
import { ref, onValue, push, child, remove } from "firebase/database";
//TaskList components
import TaskListButton from '../../components/TaskList/TaskListButton';
import AddTaskList from '../../components/TaskList/AddTaskList';
import TaskLists from '../../components/TaskList/TaskLists';
//Buttons
import GoBackButton from '../GoBackButton'
import Button from '../Button'
//Utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//Context
import { useAuth } from '../../contexts/AuthContext';

export default function ManageTaskLists() {

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { t } = useTranslation('tasklist', {keyPrefix: 'tasklist'});

  //states
  const [showAddTaskList, setShowAddTaskList] = useState(false)
  const [taskLists, setTaskLists] = useState()
  //sort
  const [sortByDateAsc, setSortByDateAsc] = useState(true)
  const [sortByNameAsc, setSortByNameAsc] = useState(true)

  //load data
  useEffect(() => {
    const getTaskLists = async () => {
      await fetchTaskListsFromFireBase()
    }
    getTaskLists()
  }, [])

  /* Fetch Task Lists From Firebase */
  const fetchTaskListsFromFireBase = async () => {
    const dbref = ref(db, '/tasklists');
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const taskLists = [];
      for (let id in snap) {
        taskLists.push({ id, ...snap[id] });
      }
      setTaskLists(taskLists)
    })
  }

  /** Add Task List To Firebase */
  const addTaskList = async (taskList) => {

    //To firebase
    taskList["created"] = getCurrentDateAsJson();
    taskList["createdBy"] = currentUser.email;
    const dbref = ref(db, '/tasklists');
    push(dbref, taskList);
  }

  /** Delete Task List From Firebase */
  const deleteTaskList = async (id) => {

    //From firebase

    //delete tasks
    const dbrefTasks = ref(db, '/tasks/' + id);
    remove(dbrefTasks);

    //delete task list
    const dbref = child(ref(db, '/tasklists'), id)
    remove(dbref)
  }

  /** Navigate To Task List Archive */
  function gotoTaskListArchive() {
    navigate('/tasklistarchive')
  }

  const toggleSortDate = (taskLists) => {

    let sortedTaskLists = taskLists.sort((a, b) => new Date(a.created).setHours(0, 0, 0, 0) - new Date(b.created).setHours(0, 0, 0, 0));

    if (sortByDateAsc) {
      sortedTaskLists = sortedTaskLists.reverse();
    }

    setTaskLists(sortedTaskLists);

    //Toggle sorting
    const sortByDate = !sortByDateAsc;
    setSortByDateAsc(sortByDate);
  }

  const toggleSortName = (taskLists) => {

    let sortedTaskLists = taskLists.sort((a, b) => a.title.localeCompare(b.title));

    if (sortByNameAsc) {
      sortedTaskLists = sortedTaskLists.reverse();
    }

    setTaskLists(sortedTaskLists);

    //Toggle sorting
    const sortByName = !sortByNameAsc;
    setSortByNameAsc(sortByName);
  }

  return (
    <div>
      <Row>
        <ButtonGroup>
          <GoBackButton />
          <TaskListButton
            onShowAddTaskList={() => setShowAddTaskList(!showAddTaskList)}
            showAdd={showAddTaskList}>
          </TaskListButton>
          <Button text={t('button_goto_tasklist_archive')} color="#545454" onClick={() => gotoTaskListArchive()} />
        </ButtonGroup>
      </Row>
      <h3 className="page-title">{t('manage_tasklists_title')}</h3>
      {t('sorting')}: &nbsp;
      <Button onClick={() => toggleSortDate(taskLists)} text={t('created_date')} />&nbsp;
      <Button onClick={() => toggleSortName(taskLists)} text={t('name')} />
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
