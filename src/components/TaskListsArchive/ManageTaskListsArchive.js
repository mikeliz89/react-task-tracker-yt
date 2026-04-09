import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import TaskLists from '../../components/TaskList/TaskLists';
import ManagePage from '../Site/ManagePage';
import { TRANSLATION, DB } from '../../utils/Constants';
import { removeFromFirebaseById } from '../../datatier/datatier';
import useFetch from '../Hooks/useFetch';

export default function ManageTaskListsArchive() {

  //translation
  const { t } = useTranslation(TRANSLATION.TASKLIST, { keyPrefix: TRANSLATION.TASKLIST });
  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

  const location = useLocation();

  //fetch data
  const { data: taskLists,
    originalData: originalTaskLists, counter, loading } =
    useFetch(DB.TASKLIST_ARCHIVE, location.state.listType);

  const deleteTaskList = async (id) => {
    //delete tasks
    removeFromFirebaseById(DB.TASKLIST_ARCHIVE_TASKS, id);
    //delete task list
    removeFromFirebaseById(DB.TASKLIST_ARCHIVE, id);
  }

  return (
    <ManagePage
      loading={loading}
      loadingText={tCommon("loading")}
      title={t('manage_tasklists_archive_title')}
      hasItems={taskLists != null && taskLists.length > 0}
      emptyText={t('no_task_lists_to_show')}
    >
      <>
        <TaskLists
          archived={true}
          taskLists={taskLists}
          originalList={originalTaskLists}
          counter={counter}
          onDelete={deleteTaskList}
        />
      </>
    </ManagePage>
  )
}