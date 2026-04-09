import i18n from "i18next";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import CommentComponent from '../Comments/CommentComponent';
import useFetch from '../Hooks/useFetch';
import LinkComponent from '../Links/LinkComponent';
import DetailsPage from '../Site/DetailsPage';
import PageTitle from '../Site/PageTitle';

import AddTask from './AddTask';

export default function TaskDetails() {

  //params
  const params = useParams();

  //translation  
  const { t } = useTranslation(TRANSLATION.TASKLIST, { keyPrefix: TRANSLATION.TASKLIST });

  //states
  const [showEditTask, setShowEditTask] = useState(false);

  //fetch data
  const { data: task, loading } = useFetch(DB.TASKS, "", params.tasklistid, params.id);

  //auth
  const { currentUser } = useAuth();

  const updateTask = async (taskListID, task) => {
    let taskID = params.id;
    task["modified"] = getCurrentDateAsJson();
    updateToFirebaseByIdAndSubId(DB.TASKS, taskListID, taskID, task);
  }

  const addCommentToTask = async (comment) => {
    let taskID = params.id;
    comment["created"] = getCurrentDateAsJson()
    comment["createdBy"] = currentUser.email;
    comment["creatorUserID"] = currentUser.uid;
    pushToFirebaseChild(DB.TASK_COMMENTS, taskID, comment);
  }

  const addLinkToTask = (link) => {
    const taskID = params.id;
    link["created"] = getCurrentDateAsJson();
    pushToFirebaseChild(DB.TASK_LINKS, taskID, link);
  }

  return (
    <DetailsPage
      loading={loading}
      showEditButton={true}
      isEditOpen={showEditTask}
      onToggleEdit={() => setShowEditTask(!showEditTask)}
      title={<PageTitle title={task?.text} />}
      titleSuffix={
        <span className={`details-pill ${task?.reminder === true ? 'details-pill-ready' : 'details-pill-not-ready'}`}>
          {task?.reminder === true ? t('ready') : t('unfinished')}
        </span>
      }
      summary={`${t('task_text')}: ${task?.day || '-'}`}
      metaItems={[
        {
          id: 1,
          content: <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(task?.created, i18n.language)}</span></>
        },
        {
          id: 2,
          content: <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(task?.modified, i18n.language)}</span></>
        },
        {
          id: 3,
          content: <><span className="detailspage-meta-label">{t('by')}:</span> <span className="detailspage-meta-value">{task?.createdBy}</span></>
        }
      ]}
      editSection={<AddTask onClose={() => setShowEditTask(false)} onSave={updateTask} taskID={params.id} taskListID={params.tasklistid} />}
      commentColLg={6}
      commentSection={<CommentComponent objID={params.id} url={DB.TASK_COMMENTS} onSave={addCommentToTask} />}
      linkSection={<LinkComponent objID={params.id} url={DB.TASK_LINKS} onSaveLink={addLinkToTask} />}
    />
  );
}


