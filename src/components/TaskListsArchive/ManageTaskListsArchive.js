import GoBackButton from '../Buttons/GoBackButton';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import TaskLists from '../../components/TaskList/TaskLists';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import * as Constants from '../../utils/Constants';
import { removeFromFirebaseById } from '../../datatier/datatier';
import { ButtonGroup, Row } from 'react-bootstrap';
import useFetch from '../useFetch';

export default function ManageTaskListsArchive() {

  //translation
  const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_TASKLIST });
  const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

  const location = useLocation();

  //fetch data
  const { data: taskLists,
    originalData: originalTaskLists, counter, loading } =
    useFetch(Constants.DB_TASKLIST_ARCHIVE, location.state.listType);

  const deleteTaskList = async (id) => {
    //delete tasks
    removeFromFirebaseById(Constants.DB_TASKLIST_ARCHIVE_TASKS, id);
    //delete task list
    removeFromFirebaseById(Constants.DB_TASKLIST_ARCHIVE, id);
  }

  return loading ? (
    <h3>{tCommon("loading")}</h3>
  ) : (
    <PageContentWrapper>

      <PageTitle title={t('manage_tasklists_archive_title')} />

      <Row>
        <ButtonGroup>
          <GoBackButton />
        </ButtonGroup>
      </Row>

      {taskLists != null && taskLists.length > 0 ? (
        <>
          <Counter list={taskLists} originalList={originalTaskLists} counter={counter} />
          <TaskLists
            archived={true}
            taskLists={taskLists}
            onDelete={deleteTaskList}
          />
        </>
      ) : (
        <>
          <CenterWrapper>
            {t('no_task_lists_to_show')}
          </CenterWrapper>
        </>
      )
      }
    </PageContentWrapper>
  )
}