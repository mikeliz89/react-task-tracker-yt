//react
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//firebase
import { ref, onValue, child } from "firebase/database";
import { db } from '../../firebase-config';
//tasks
import Tasks from '../../components/Task/Tasks';
//buttons
import GoBackButton from '../GoBackButton';

export default function ArchivedTaskListDetails() {

  //params
  const params = useParams();

  //states
  const [tasks, setTasks] = useState();

  //translation
  const { t } = useTranslation('tasklist', { keyPrefix: 'tasklist' });

  //load data
  useEffect(() => {
    let cancel = false;

    //Tasks
    const getTasks = async () => {
      if (cancel) {
        return;
      }
      await fetchTasksFromFirebase()
    }
    getTasks()

    return () => {
      cancel = true;
    }
  }, [])

  /** Fetch Tasks From Database */
  const fetchTasksFromFirebase = async () => {
    const dbref = await child(ref(db, '/tasklist-archive-tasks'), params.id);
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const tasks = [];
      for (let id in snap) {
        tasks.push({ id, ...snap[id] });
      }
      setTasks(tasks);
    })
  }

  return (
    <div>
      <GoBackButton />
      <div className="page-content">
        {tasks != null && tasks.length > 0 ? (
          <Tasks
            archived={true}
            taskListID={params.id}
            tasks={tasks}
          />
        ) : (
          t('no_tasks_to_show')
        )}
      </div>
    </div>
  )
}
