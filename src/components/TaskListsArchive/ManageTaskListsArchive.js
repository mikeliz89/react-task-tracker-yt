import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { ref, onValue, remove } from "firebase/database";
import TaskLists from '../../components/TaskList/TaskLists';

const ManageTaskListsArchive = () => {

  const { t } = useTranslation();

  const [taskLists, setTaskLists] = useState();

  //load data
  useEffect(() => {
    const getArchivedTaskLists = async () => {
        await fetchTaskListsFromFireBase()
    }
    getArchivedTaskLists()
    }, [])

  const fetchTaskListsFromFireBase = async () => {
    const dbref = ref(db, '/tasklist-archive');
    onValue(dbref, (snapshot) => {
        const snap = snapshot.val();
        const taskLists = [];
        for(let id in snap) {
          taskLists.push({id, ...snap[id]});
        }
        setTaskLists(taskLists)
    })
  }

  // Delete Task List
  const deleteTaskList = async (id) => {

    //delete tasks
    const dbrefTasks = ref(db, `/tasklist-archive-tasks/${id}`);
    remove(dbrefTasks);

    //delete task list
    const dbref = ref(db, `/tasklist-archive/${id}`);
    remove(dbref)
  }

  return (
    <div>
      <GoBackButton  />
      <h3 className="page-title">{t('manage_tasklists_archive_title')}</h3>
      <div className="page-content">
       {taskLists != null && taskLists.length > 0 ? (
          <TaskLists
          archived={true}
          taskLists={taskLists}
          onDelete={deleteTaskList} 
            />
          ) : (
            <div>
                {t('no_task_lists_to_show')}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default ManageTaskListsArchive