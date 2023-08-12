import GoBackButton from '../Buttons/GoBackButton';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import TaskLists from '../../components/TaskList/TaskLists';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import * as Constants from '../../utils/Constants';
import { removeFromFirebaseById } from '../../datatier/datatier';

const ManageTaskListsArchive = () => {

  //translation
  const { t } = useTranslation(Constants.TRANSLATION_TASKLIST, { keyPrefix: Constants.TRANSLATION_TASKLIST });

  const location = useLocation();

  //states
  const [loading, setLoading] = useState(true);
  const [taskLists, setTaskLists] = useState();
  const [originalTaskLists, setOriginalTaskLists] = useState();
  const [counter, setCounter] = useState(0);

  //load data
  useEffect(() => {
    const getArchivedTaskLists = async () => {
      await fetchTaskListsFromFireBase();
    }
    getArchivedTaskLists();
  }, [])

  const fetchTaskListsFromFireBase = async () => {
    const dbref = ref(db, Constants.DB_TASKLIST_ARCHIVE);
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      let counterTemp = 0;
      for (let id in snap) {
        const item = snap[id];
        const myListType = location.state.listType;
        if ((item["listType"] === myListType && myListType > 0) ||
          (item["listType"] === undefined && myListType === 0)) {
          counterTemp++;
          fromDB.push({ id, ...snap[id] });
        }
      }
      setCounter(counterTemp);
      setTaskLists(fromDB);
      setOriginalTaskLists(fromDB);
      setLoading(false);
    })
  }

  const deleteTaskList = async (id) => {
    //delete tasks
    removeFromFirebaseById(Constants.DB_TASKLIST_ARCHIVE_TASKS, id);
    //delete task list
    removeFromFirebaseById(Constants.DB_TASKLIST_ARCHIVE, id);
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <PageContentWrapper>

      <PageTitle title={t('manage_tasklists_archive_title')} />

      <GoBackButton />

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

export default ManageTaskListsArchive