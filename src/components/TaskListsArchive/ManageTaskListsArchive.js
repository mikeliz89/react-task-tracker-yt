import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { ref, onValue, remove } from "firebase/database";
import TaskLists from '../../components/TaskList/TaskLists';
import PageTitle from '../PageTitle';
import PageContentWrapper from '../PageContentWrapper';
import CenterWrapper from '../CenterWrapper';
import Counter from '../Counter';
import * as Constants from '../../utils/Constants';

/** TODO: ohjaa listaTypen mukaiseen arkistoon esim Programming osion listoilta */
const ManageTaskListsArchive = ({ listType }) => {

  //translation
  const { t } = useTranslation(Constants.TRANSLATION_TASKLIST, { keyPrefix: Constants.TRANSLATION_TASKLIST });

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
        if (item["listType"] === listType) {
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
    const dbrefTasks = ref(db, `${Constants.DB_TASKLIST_ARCHIVE_TASKS}/${id}`);
    remove(dbrefTasks);

    //delete task list
    const dbref = ref(db, `${Constants.DB_TASKLIST_ARCHIVE}/${id}`);
    remove(dbref)
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <PageContentWrapper>
      <GoBackButton />
      <PageTitle title={t('manage_tasklists_archive_title')} />

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