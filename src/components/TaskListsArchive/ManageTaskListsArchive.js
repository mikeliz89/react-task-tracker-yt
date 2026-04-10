import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import TaskLists from '../../components/TaskList/TaskLists';
import { removeFromFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import useFetch from '../Hooks/useFetch';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import ManagePage from '../Site/ManagePage';

export default function ManageTaskListsArchive() {

  //translation
  const { t } = useTranslation(TRANSLATION.TASKLIST, { keyPrefix: TRANSLATION.TASKLIST });

const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

  const location = useLocation();

  //fetch data
  const { data: taskLists, setData: setTaskLists,
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
      searchSortFilter={{
        onSet: setTaskLists,
        originalList: originalTaskLists,
        //search
        showSearchByText: true,
        showSearchByDescription: true,
        //sort
        showSortByTitle: true,
        showSortByCreatedDate: true,
        //filter
        filterMode: FilterMode.Title,
      }}
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


