import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ButtonGroup, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddTask from './AddTask';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import i18n from "i18next";
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import LinkComponent from '../Links/LinkComponent';
import CommentComponent from '../Comments/CommentComponent';
import useFetch from '../useFetch';

export default function TaskDetails() {

  //params
  const params = useParams();

  //translation  
  const { t } = useTranslation(Constants.TRANSLATION_TASKLIST, { keyPrefix: Constants.TRANSLATION_TASKLIST });

  //states
  const [showEditTask, setShowEditTask] = useState(false);

  //fetch data
  const { data: task, loading } = useFetch(Constants.DB_TASKS, "", params.tasklistid, params.id);

  //auth
  const { currentUser } = useAuth();

  const updateTask = async (taskListID, task) => {
    let taskID = params.id;
    task["modified"] = getCurrentDateAsJson();
    updateToFirebaseByIdAndSubId(Constants.DB_TASKS, taskListID, taskID, task);
  }

  const addCommentToTask = async (comment) => {
    let taskID = params.id;
    comment["created"] = getCurrentDateAsJson()
    comment["createdBy"] = currentUser.email;
    comment["creatorUserID"] = currentUser.uid;
    pushToFirebaseChild(Constants.DB_TASK_COMMENTS, taskID, comment);
  }

  const addLinkToTask = (link) => {
    const taskID = params.id;
    link["created"] = getCurrentDateAsJson();
    pushToFirebaseChild(Constants.DB_TASK_LINKS, taskID, link);
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <PageContentWrapper>
      <Row>
        <ButtonGroup aria-label="Button group">
          <GoBackButton />
          <Button
            iconName={Constants.ICON_EDIT}
            text={showEditTask ? t('button_close') : t('button_edit')}
            color={showEditTask ? Constants.COLOR_EDITBUTTON_OPEN : Constants.COLOR_EDITBUTTON_CLOSED}
            onClick={() => setShowEditTask(!showEditTask)} />
        </ButtonGroup>
      </Row>
      <div className={task.reminder === true ? 'listContainer reminder' : ''}>
        <PageTitle title={task.text} />
        <p>{t('task_text')}: {task.day}</p>
        {showEditTask && <AddTask onClose={() => setShowEditTask(false)} onSave={updateTask} taskID={params.id} taskListID={params.tasklistid} />}
        <Table>
          <tbody>
            <tr>
              <td>{t('created')}: {getJsonAsDateTimeString(task.created, i18n.language)}</td>
            </tr>
            <tr>
              <td>{t('created_by')}: {task.createdBy}</td>
            </tr>
            <tr>
              <td>{t('modified')}: {getJsonAsDateTimeString(task.modified, i18n.language)}</td>
            </tr>
            <tr>
              <td>{t('set_reminder')}: {task.reminder === true ? t('yes') : t('no')}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <CommentComponent objID={params.id} url={Constants.DB_TASK_COMMENTS} onSave={addCommentToTask} />

      <LinkComponent objID={params.id} url={Constants.DB_TASK_LINKS} onSaveLink={addLinkToTask} />
    </PageContentWrapper>
  );
}