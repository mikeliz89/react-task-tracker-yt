//react
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonGroup, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
//Buttons
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//Firebase
import { db } from '../../firebase-config';
import { ref, onValue, update, push, child } from "firebase/database";
//task
import AddTask from './AddTask';
//comment
import AddComment from '../Comments/AddComment';
import Comments from '../Comments/Comments';
//utils
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
//i18n
import i18n from "i18next";
//auth
import { useAuth } from '../../contexts/AuthContext';
//links
import AddLink from '../Links/AddLink';
import Links from '../Links/Links';
//pagetitle
import PageTitle from '../PageTitle';

function TaskDetails() {

  const DB_TASKS = '/tasks';
  const DB_TASK_COMMENTS = '/task-comments';
  const DB_TASK_LINKS = '/task-links';

  //translation
  const { t } = useTranslation('tasklist', { keyPrefix: 'tasklist' });

  //states
  const [showEditTask, setShowEditTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState({});

  //params
  const params = useParams();

  //navigate
  const navigate = useNavigate();

  //auth
  const { currentUser } = useAuth();

  //load data
  useEffect(() => {
    const getTask = async () => {
      await fetchTaskFromFirebase();
    }
    getTask();
  }, []);

  const fetchTaskFromFirebase = async () => {
    const dbref = ref(db, `${DB_TASKS}/${params.tasklistid}/${params.id}`);
    onValue(dbref, (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        navigate(-1)
      }
      setTask(data)
      setLoading(false);
    })
  }

  const updateTask = async (taskListID, task) => {
    let taskID = params.id;
    const updates = {};
    task["modified"] = getCurrentDateAsJson()
    updates[`${DB_TASKS}/${taskListID}/${taskID}`] = task;
    update(ref(db), updates);
  }

  const addCommentToTask = async (comment) => {
    let taskID = params.id;
    comment["created"] = getCurrentDateAsJson()
    comment["createdBy"] = currentUser.email;
    comment["creatorUserID"] = currentUser.uid;
    const dbref = child(ref(db, DB_TASK_COMMENTS), taskID);
    push(dbref, comment);
  }

  const addLinkToTask = (link) => {
    const taskID = params.id;
    link["created"] = getCurrentDateAsJson();
    const dbref = child(ref(db, DB_TASK_LINKS), taskID);
    push(dbref, link);
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <div>
      <Row>
        <ButtonGroup aria-label="Button group">
          <GoBackButton />
          <Button
            iconName='edit'
            text={showEditTask ? t('button_close') : t('button_edit')}
            color={showEditTask ? 'red' : 'orange'}
            onClick={() => setShowEditTask(!showEditTask)} />
        </ButtonGroup>
      </Row>
      <div className={task.reminder === true ? 'task reminder' : ''}>
        <PageTitle title={task.text} />
        <p>{t('day_and_time')}: {task.day}</p>
        {showEditTask && <AddTask onClose={() => setShowEditTask(false)} onSave={updateTask} taskID={params.id} taskListID={params.tasklistid} />}
        <p>
          {t('created')}: {getJsonAsDateTimeString(task.created, i18n.language)}<br />
          {t('created_by')}: {task.createdBy}<br />
          {t('modified')}: {getJsonAsDateTimeString(task.modified, i18n.language)}
        </p>
        <p>{t('set_reminder')}: {task.reminder === true ? t('yes') : t('no')}</p>
      </div>
      <AddComment onSave={addCommentToTask} />
      <AddLink onSaveLink={addLinkToTask} />
      <Comments objID={params.id} url={'task-comments'} />
      <Links objID={params.id} url={'task-links'} />
    </div>
  );
};

export default TaskDetails;
