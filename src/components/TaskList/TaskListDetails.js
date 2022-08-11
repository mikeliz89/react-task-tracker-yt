//react
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Row, ButtonGroup, Accordion, Table, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
//buttons
import Button from '../Button';
import GoBackButton from '../GoBackButton';
//tasklist and task
import AddTask from '../Task/AddTask';
import AddTaskList from '../TaskList/AddTaskList';
import Tasks from '../Task/Tasks';
//auth
import { useAuth } from '../../contexts/AuthContext';
//firebase
import { db } from '../../firebase-config';
import { update, ref, onValue, push, child, remove, get } from "firebase/database";
//utils
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
//i18n
import i18n from "i18next";
//Links
import Links from '../Links/Links';
import AddLink from '../Links/AddLink';
//pagetitle
import PageTitle from '../PageTitle';
//SearchSortFilter
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';

function TaskListDetails() {

  //constants
  const DB_TASKS = '/tasks';
  const DB_TASK_LISTS = '/tasklists';
  const DB_TASK_LIST_LINKS = '/tasklist-links';
  const DB_TASK_LIST_ARCHIVE = '/tasklist-archive';
  const DB_TASK_LIST_ARCHIVE_TASKS = '/tasklist-archive-tasks';

  //translation
  const { t } = useTranslation('tasklist', { keyPrefix: 'tasklist' });
  //states
  const [loading, setLoading] = useState(true);
  const [taskList, setTaskList] = useState({});
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTaskList, setShowEditTaskList] = useState(false);
  const [tasks, setTasks] = useState();
  const [originalTasks, setOriginalTasks] = useState();

  //counters
  const [taskCounter, setTaskCounter] = useState(0);
  const [taskReadyCounter, setTaskReadyCounter] = useState(0);
  //params
  const params = useParams();
  //navigate
  const navigate = useNavigate();
  //user
  const { currentUser } = useAuth();

  //load data
  useEffect(() => {
    let cancel = false;

    const getTaskList = async () => {
      if (cancel) return;
      await fetchTaskListFromFirebase();
    }
    getTaskList();

    const getTasks = async () => {
      await fetchTasksFromFirebase();
    }
    getTasks();

    return () => {
      cancel = true;
    }
  }, [])

  /** Fetch Task List From Firebase */
  const fetchTaskListFromFirebase = async () => {
    const dbref = ref(db, `${DB_TASK_LISTS}/${params.id}`);
    onValue(dbref, (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        navigate('/');
      }
      setTaskList(data);
      setLoading(false);
    })
  }

  /** Fetch Tasks From Firebase */
  const fetchTasksFromFirebase = async () => {
    const dbref = await child(ref(db, DB_TASKS), params.id);
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      let taskCounterTemp = 0;
      let taskReadyCounterTemp = 0;
      for (let id in snap) {
        taskCounterTemp++;
        if (snap[id]["reminder"] === true) {
          taskReadyCounterTemp++;
        }
        fromDB.push({ id, ...snap[id] });
      }
      setTasks(fromDB);
      setOriginalTasks(fromDB);
      setTaskCounter(taskCounterTemp);
      setTaskReadyCounter(taskReadyCounterTemp);
    })
  }

  /** Add Task To FireBase */
  const addTask = async (taskListID, task) => {
    task["created"] = getCurrentDateAsJson();
    task["createdBy"] = currentUser.email;
    const dbref = child(ref(db, DB_TASKS), taskListID);
    push(dbref, task);
  }

  /** Delete Task From Firebase */
  const deleteTask = async (taskListID, id) => {
    const dbref = ref(db, `${DB_TASKS}/${taskListID}/${id}`);
    remove(dbref);
  }

  /** Toggle Reminder Of A Task At Firebase */
  const toggleReminder = async (taskListID, id) => {
    const dbref = ref(db, `${DB_TASKS}/${taskListID}/${id}`);
    get(dbref).then((snapshot) => {
      if (snapshot.exists()) {
        const updates = {};
        const oldReminder = snapshot.val()["reminder"];
        updates[`${DB_TASKS}/${taskListID}/${id}/reminder`] = !oldReminder;
        update(ref(db), updates);
      } else {
        console.log("No data available");
      }
    });
  }

  const markAllTasksDone = async (taskListID) => {
    const dbref = child(ref(db, DB_TASKS), taskListID);
    get(dbref).then((snapshot) => {
      if (snapshot.exists()) {
        //update each snapshot data separately (child)
        snapshot.forEach((data) => {
          //console.log(data.val());
          const updates = {};
          updates[`${DB_TASKS}/${taskListID}/${data.key}/reminder`] = true;
          update(ref(db), updates);
        });
      } else {
        console.log("No data available");
      }
    });
  }

  /** Add Task List To Firebase */
  const addTaskList = async (taskList) => {
    var taskListID = params.id;
    //save edited task list to firebase
    const updates = {};
    taskList["modified"] = getCurrentDateAsJson();
    updates[`${DB_TASK_LISTS}/${taskListID}`] = taskList;
    update(ref(db), updates);
  }

  /** Archive Task List At Firebase */
  function archiveTaskList(taskList) {
    //1. add this taskList to tasklist-archive
    const dbref = ref(db, DB_TASK_LIST_ARCHIVE);
    taskList["archived"] = getCurrentDateAsJson();
    taskList["archivedBy"] = currentUser.email;
    let archiveTaskListID = push(dbref, taskList).key;

    const taskListID = params.id;

    //2. delete old task lists
    const taskListRef = ref(db, `${DB_TASK_LISTS}/${taskListID}`);
    get(taskListRef).then((snapshot) => {
      if (snapshot.exists()) {
        let updates = {};
        updates[`${DB_TASK_LISTS}/${taskListID}`] = null;
        update(ref(db), updates);
      } else {
        console.log("No data available for taskLists");
      }
    })

    //3. delete old tasks, create new tasklist-archive-tasks
    const tasksRef = ref(db, `${DB_TASKS}/${taskListID}`);
    get(tasksRef).then((snapshot) => {
      if (snapshot.exists()) {
        var data = snapshot.val();
        let updates = {};
        updates[`${DB_TASKS}/${taskListID}`] = null;
        updates[`${DB_TASK_LIST_ARCHIVE_TASKS}/${archiveTaskListID}`] = data;
        update(ref(db), updates);
      } else {
        console.log("No data available");
      }
    });
  }

  const addLinkToTaskList = (link) => {
    const taskListID = params.id;
    link["created"] = getCurrentDateAsJson();
    const dbref = child(ref(db, DB_TASK_LIST_LINKS), taskListID);
    push(dbref, link);
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <div>
      {/* <pre>{JSON.stringify(taskList)}</pre> */}
      <Row>
        <ButtonGroup aria-label="Button group">
          <GoBackButton />
          <Button showIconEdit={true} text={showEditTaskList ? t('button_close') : ''}
            color={showEditTaskList ? 'red' : 'orange'}
            onClick={() => setShowEditTaskList(!showEditTaskList)} />
          <Button showIconAdd={true} color={showAddTask ? 'red' : 'green'}
            text={showAddTask ? t('button_close') : ''}
            onClick={() => setShowAddTask(!showAddTask)} />
          <Button color="#545454" iconName='archive'
            onClick={() => { if (window.confirm(t('archive_list_confirm_message'))) { archiveTaskList(taskList); } }}
          />
        </ButtonGroup>
      </Row>
      {/* Accordion */}
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <PageTitle title={taskList.title} iconName='list-alt' iconColor='gray' />
          </Accordion.Header>
          <Accordion.Body>
            {t('description')}: {taskList.description}<br />
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>{t('created')}</td>
                  <td>{getJsonAsDateTimeString(taskList.created, i18n.language)}</td>
                </tr>
                <tr>
                  <td>{t('created_by')}</td>
                  <td>{taskList.createdBy}</td>
                </tr>
                <tr>
                  <td>{t('modified')}</td>
                  <td>{getJsonAsDateTimeString(taskList.modified, i18n.language)}</td>
                </tr>
                <tr>
                  <td>{t('tasks_ready_counter')}</td>
                  <td>{taskReadyCounter}/{taskCounter}</td>
                </tr>
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* <div>{searchString}</div> */}
      <div className="page-content">
        <Button onClick={() => markAllTasksDone(params.id)} text={t('mark_all_tasks_done')} iconName='square-check' />
        {showEditTaskList && <AddTaskList onAddTaskList={addTaskList} taskListID={params.id} onClose={() => setShowEditTaskList(false)} />}
        {showAddTask && <AddTask onClose={() => setShowAddTask(false)} taskListID={params.id} onAddTask={addTask} />}

        <SearchSortFilter
          useTextFiltering={true}
          showFilterReady={true}
          showFilterNotReady={true}
          onSet={setTasks}
          showSortByText={true}
          showSortByCreatedDate={true}
          originalList={originalTasks} />
        {tasks != null && tasks.length > 0 ? (
          <>
            <Tasks
              taskListID={params.id}
              tasks={tasks}
              onDelete={deleteTask}
              onToggle={toggleReminder}
            />
          </>
        ) : (
          t('no_tasks_to_show')
        )}
        <Row />
        <AddLink onSaveLink={addLinkToTaskList} />
        <Links objID={params.id} url={'tasklist-links'} />
      </div>
    </div>
  );
};

export default TaskListDetails;
