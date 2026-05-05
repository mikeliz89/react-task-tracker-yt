import i18n from "i18next";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import useFetch from '../Hooks/useFetch';
import DetailsPage from '../Site/DetailsPage';

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

  const updateTask = async (taskListID, task) => {
    let taskID = params.id;
    task["modified"] = getCurrentDateAsJson();
    updateToFirebaseByIdAndSubId(DB.TASKS, taskListID, taskID, task);
  }

  return (
    <DetailsPage
      item={task}
      id={params.id}
      dbKey={DB.TASKS}
      loading={loading}
      showEditButton={true}
      isEditOpen={showEditTask}
      onToggleEdit={() => setShowEditTask(!showEditTask)}
      title={task?.text}
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
      commentProps={{
        showComment: true,
        commentUrl: DB.TASK_COMMENTS
      }}
      linkProps={{
        showLink: true,
        linkUrl: DB.TASK_LINKS
      }}
    />
  );
}


