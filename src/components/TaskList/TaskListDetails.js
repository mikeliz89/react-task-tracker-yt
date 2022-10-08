import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Row, ButtonGroup, Accordion, Table, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import GoBackButton from '../GoBackButton';
import AddTask from '../Task/AddTask';
import AddTaskList from '../TaskList/AddTaskList';
import Tasks from '../Task/Tasks';
import ChangeType from './ChangeType';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase-config';
import { ref, onValue, child, get } from 'firebase/database';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import i18n from "i18next";
import PageTitle from '../PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import PageContentWrapper from '../PageContentWrapper';
import CenterWrapper from '../CenterWrapper';
import Counter from '../Counter';
import {
  removeFromFirebaseByIdAndSubId, pushToFirebaseChild, pushToFirebase,
  updateToFirebase, getFromFirebaseByIdAndSubId, getFromFirebaseById
} from '../../datatier/datatier';
import { getPageTitleContent } from '../../utils/ListUtils';
import LinkComponent from '../Links/LinkComponent';
import CommentComponent from '../Comments/CommentComponent';

function TaskListDetails() {

  //translation
  const { t } = useTranslation(Constants.TRANSLATION_TASKLIST, { keyPrefix: Constants.TRANSLATION_TASKLIST });

  //states
  const [loading, setLoading] = useState(true);
  const [taskList, setTaskList] = useState({});
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTaskList, setShowEditTaskList] = useState(false);
  const [tasks, setTasks] = useState();
  const [originalTasks, setOriginalTasks] = useState();
  const [showChangeListType, setShowChangeListType] = useState(false);

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
      if (cancel) {
        return;
      }
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

  const fetchTaskListFromFirebase = async () => {
    const dbref = ref(db, `${Constants.DB_TASKLISTS}/${params.id}`);
    onValue(dbref, (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        navigate('/');
      }
      setTaskList(data);
      setLoading(false);
    })
  }

  const fetchTasksFromFirebase = async () => {
    const dbref = await child(ref(db, Constants.DB_TASKS), params.id);
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

  const updateTask = async (taskListID, task) => {
    task["created"] = getCurrentDateAsJson();
    task["createdBy"] = currentUser.email;
    pushToFirebaseChild(Constants.DB_TASKS, taskListID, task);
  }

  const deleteTask = async (taskListID, id) => {
    removeFromFirebaseByIdAndSubId(Constants.DB_TASKS, taskListID, id);
  }

  const toggleReminder = async (taskListID, id) => {
    getFromFirebaseByIdAndSubId(Constants.DB_TASKS, taskListID, id).then((val) => {
      const updates = {};
      const oldReminder = val["reminder"];
      updates[`${Constants.DB_TASKS}/${taskListID}/${id}/reminder`] = !oldReminder;
      updateToFirebase(updates);
    });
  }

  const markAllTasksDone = async (taskListID) => {
    const dbref = child(ref(db, Constants.DB_TASKS), taskListID);
    get(dbref).then((snapshot) => {
      if (snapshot.exists()) {
        //update each snapshot data separately (child)
        snapshot.forEach((data) => {
          const updates = {};
          updates[`${Constants.DB_TASKS}/${taskListID}/${data.key}/reminder`] = true;
          updateToFirebase(updates);
        });
      } else {
        console.log("No data available");
      }
    });
  }

  const updateTaskList = async (taskList) => {
    var taskListID = params.id;
    if (taskList["listType"] === undefined || taskList["listType"] === 0) {
      delete taskList["listType"];
    }
    taskList["modified"] = getCurrentDateAsJson();
    const updates = {};
    updates[`${Constants.DB_TASKLISTS}/${taskListID}`] = taskList;
    updateToFirebase(updates);
  }

  async function archiveTaskList(taskList) {
    //1. add this taskList to tasklist-archive
    taskList["archived"] = getCurrentDateAsJson();
    taskList["archivedBy"] = currentUser.email;

    let archiveTaskListID = await pushToFirebase(Constants.DB_TASKLIST_ARCHIVE, taskList);

    const taskListID = params.id;

    //2. delete old task lists
    getFromFirebaseById(Constants.DB_TASKLISTS, taskListID).then((val) => {
      let updates = {};
      updates[`${Constants.DB_TASKLISTS}/${taskListID}`] = null;
      updateToFirebase(updates);
    })

    //3. delete old tasks, create new tasklist-archive-tasks
    getFromFirebaseById(Constants.DB_TASKS, taskListID).then((val) => {
      let updates = {};
      updates[`${Constants.DB_TASKS}/${taskListID}`] = null;
      updates[`${Constants.DB_TASKLIST_ARCHIVE_TASKS}/${archiveTaskListID}`] = val;
      updateToFirebase(updates);
    });
  }

  const addCommentToTaskList = async (comment) => {
    const taskListID = params.id;
    comment["created"] = getCurrentDateAsJson()
    comment["createdBy"] = currentUser.email;
    comment["creatorUserID"] = currentUser.uid;
    pushToFirebaseChild(Constants.DB_TASKLIST_COMMENTS, taskListID, comment);
  }

  const addLinkToTaskList = (link) => {
    const taskListID = params.id;
    link["created"] = getCurrentDateAsJson();
    pushToFirebaseChild(Constants.DB_TASKLIST_LINKS, taskListID, link);
  }

  const copyToClipboard = () => {
    let text = "";
    tasks.forEach(function (arrayItem) {
      text += "*" + arrayItem.text.trim() + "*";
      if (arrayItem.day) {
        text += ": " + arrayItem.day;
      }
      if (arrayItem.reminder) {
        text += "" + ' [x]';
      } else {
        text += "" + ' [ ]';
      }
      text += "\n";
    });
    navigator.clipboard.writeText(text);
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <PageContentWrapper>
      {/* <pre>{JSON.stringify(taskList)}</pre> */}
      <Row>
        <ButtonGroup aria-label="Button group">
          <GoBackButton />
          <Button
            iconName='edit'
            text={showEditTaskList ? t('button_close') : ''}
            color={showEditTaskList ? 'red' : 'orange'}
            onClick={() => setShowEditTaskList(!showEditTaskList)} />
          <Button color="#545454" iconName='archive'
            onClick={() => {
              if (window.confirm(t('archive_list_confirm_message'))) {
                archiveTaskList(taskList);
              }
            }}
          />
        </ButtonGroup>
      </Row>
      <Row>
        <Col>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <PageTitle title={taskList.title} iconName='list-alt' iconColor='gray' />
              </Accordion.Header>
              <Accordion.Body>
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
                    <tr>
                      <td>{t('category')}</td>
                      <td>{t(getPageTitleContent(taskList.listType))}</td>
                    </tr>
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      <Row>
        <Col>
          {t('description' + ': ')}{taskList.description}
        </Col>
      </Row>

      {
        showChangeListType &&
        <ChangeType taskList={taskList}
          onSave={updateTaskList}
          onClose={() => setShowChangeListType(false)} />
      }

      {showEditTaskList &&
        <AddTaskList onSave={updateTaskList} taskListID={params.id} onClose={() => setShowEditTaskList(false)} />
      }

      <Tabs defaultActiveKey="home"
        id="taskListDetails-Tab"
        className="mb-3">
        <Tab eventKey="home" title={t('tabheader_tasks')}>
          <SearchSortFilter
            useTextFiltering={true}
            showFilterReady={true}
            showFilterNotReady={true}
            onSet={setTasks}
            showSortByText={true}
            showSortByCreatedDate={true}
            originalList={originalTasks} />

          <CenterWrapper>
            <Button
              iconName='plus'
              color={showAddTask ? 'red' : 'green'}
              text={showAddTask ? t('button_close') : t('button_add_task')}
              onClick={() => setShowAddTask(!showAddTask)} />
          </CenterWrapper>
          {showAddTask && <AddTask onClose={() => setShowAddTask(false)} taskListID={params.id} onSave={updateTask} />}

          {tasks != null && tasks.length > 0 ? (
            <>
              <Counter list={tasks} originalList={originalTasks} counter={taskCounter} text={t('tasks')} />
              <Tasks
                taskListID={params.id}
                tasks={tasks}
                onDelete={deleteTask}
                onToggle={toggleReminder}
              />
            </>
          ) : (
            <>
              <CenterWrapper>
                {t('no_tasks_to_show')}
              </CenterWrapper>
            </>
          )}
        </Tab>
        <Tab eventKey="links" title={t('tabheader_links')}>
          <LinkComponent objID={params.id} url={Constants.DB_TASKLIST_LINKS} onSaveLink={addLinkToTaskList} />
        </Tab>
        <Tab eventKey="comments" title={t('tabheader_comments')}>
          <CommentComponent objID={params.id} url={Constants.DB_TASKLIST_COMMENTS} onSave={addCommentToTaskList} />
        </Tab>
        <Tab eventKey="actions" title={t('tabheader_actions')}>
          <div style={{ marginBottom: '10px' }}>
            <Button onClick={() => copyToClipboard()} text={t('copy_to_clipboard')} iconName='copy' /> &nbsp;
            <Button onClick={() => { if (window.confirm(t('mark_all_tasks_done_confirm_message'))) { markAllTasksDone(params.id) } }} text={t('mark_all_tasks_done')} iconName='square-check' /> &nbsp;
            <Button onClick={() => setShowChangeListType(!showChangeListType)} text={t('change_list_type')} iconName='edit' />
          </div>
        </Tab>
      </Tabs>


      <Row />

    </PageContentWrapper>
  )
}

export default TaskListDetails;
