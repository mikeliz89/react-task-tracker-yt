import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AddTask from './AddTask';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS } from '../../utils/Constants';
import i18n from "i18next";
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../Site/PageTitle';
import DetailsPage from '../Site/DetailsPage';
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

  return (
    <DetailsPage
      loading={loading}
      loadingText={tCommon("loading")}
      showGoBackButton={true}
      showEditButton={true}
      isEditOpen={showEditTask}
      editButtonClosedText={tCommon('buttons.button_edit')}
      editButtonOpenText={tCommon('buttons.button_close')}
      editButtonIconName={ICONS.EDIT}
      editButtonOpenColor={COLORS.EDITBUTTON_OPEN}
      editButtonClosedColor={COLORS.EDITBUTTON_CLOSED}
      onToggleEdit={() => setShowEditTask(!showEditTask)}
      title={<PageTitle title={task?.text} />}
      titleSuffix={<span className="task-pill">{t('task_ready')}: {task?.reminder === true ? t('yes') : t('no')}</span>}
      summary={`${t('task_text')}: ${task?.day || '-'}`}
      metaItems={[
        { id: 1, content: <>{t('created')}: {getJsonAsDateTimeString(task?.created, i18n.language)}</> },
        { id: 2, content: <>{t('modified')}: {getJsonAsDateTimeString(task?.modified, i18n.language)}</> },
        { id: 3, content: <>{t('by')}: {task?.createdBy}</> }
      ]}
      editSection={showEditTask ? <AddTask onClose={() => setShowEditTask(false)} onSave={updateTask} taskID={params.id} taskListID={params.tasklistid} /> : null}
    >
      <Row className="detailspage-grid">
        <Col lg={6}>
          <CommentComponent objID={params.id} url={DB.TASK_COMMENTS} onSave={addCommentToTask} />
        </Col>
        <Col lg={12}>
          <LinkComponent objID={params.id} url={DB.TASK_LINKS} onSaveLink={addLinkToTask} />
        </Col>
      </Row>
    </DetailsPage>
  );
}