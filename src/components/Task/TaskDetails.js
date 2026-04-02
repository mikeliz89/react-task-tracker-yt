import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddTask from './AddTask';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS } from '../../utils/Constants';
import i18n from "i18next";
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../Icon';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import LinkComponent from '../Links/LinkComponent';
import CommentComponent from '../Comments/CommentComponent';
import useFetch from '../Hooks/useFetch';

export default function TaskDetails() {

  //params
  const params = useParams();

  //translation  
  const { t } = useTranslation(TRANSLATION.TASKLIST, { keyPrefix: TRANSLATION.TASKLIST });
  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

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

  return loading ? (
    <h3>{tCommon("loading")}</h3>
  ) : (
    <PageContentWrapper>
      <div className="task-details-page">
        <div className="task-details-header">
          <div className="task-details-actions-row">
            <GoBackButton />
            <Button
              iconName={ICONS.EDIT}
              text={showEditTask ? tCommon('buttons.button_close') : tCommon('buttons.button_edit')}
              color={showEditTask ? COLORS.EDITBUTTON_OPEN : COLORS.EDITBUTTON_CLOSED}
              onClick={() => setShowEditTask(!showEditTask)} />
          </div>

          <div className="task-details-top-row">
            <div>
              <PageTitle title={task.text} />
              <div className="task-details-pill-row">
                <span className="task-pill">Deadline: {task.day || '-'}</span>
                <span className="task-pill">{t('task_ready')}: {task.reminder === true ? t('yes') : t('no')}</span>
              </div>
            </div>
          </div>

          <p className="task-details-summary">{t('task_text')}: {task.day}</p>

          <div className="task-details-meta-row">
            <span><Icon name={ICONS.HISTORY} color="#8f9bb3" fontSize="0.95rem" /> {t('created')}: {getJsonAsDateTimeString(task.created, i18n.language)}</span>
            <span>{t('modified')}: {getJsonAsDateTimeString(task.modified, i18n.language)}</span>
            <span>{t('by')}: {task.createdBy}</span>
          </div>
        </div>

        {showEditTask && <div className="task-details-edit-card"><AddTask onClose={() => setShowEditTask(false)} onSave={updateTask} taskID={params.id} taskListID={params.tasklistid} /></div>}

        <Row className="task-details-grid">
          <Col lg={6}>
            <div className="task-detail-card">
              <CommentComponent objID={params.id} url={DB.TASK_COMMENTS} onSave={addCommentToTask} />
            </div>
          </Col>
          <Col lg={12}>
            <div className="task-detail-card">
              <LinkComponent objID={params.id} url={DB.TASK_LINKS} onSaveLink={addLinkToTask} />
            </div>
          </Col>
        </Row>
      </div>
    </PageContentWrapper>
  );
}