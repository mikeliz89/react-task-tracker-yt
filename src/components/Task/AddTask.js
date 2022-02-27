import { useState, useEffect } from 'react'
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
import { useTranslation } from 'react-i18next';

const AddTask = ({taskID, taskListID, onAddTask}) => {
    
    const { t } = useTranslation();

    //states
    const [text, setText] = useState('')
    const [day, setDay] = useState('')
    const [reminder, setReminder] = useState(false)
    const [created, setCreated] = useState('')
    const [createdBy, setCreatedBy] = useState('')

    useEffect(() => {
        if(taskID != null) {
            //Task List
            const getTask = async () => {
                await fetchTaskFromFirebase(taskID, taskListID)
            }
            getTask()
        }
      }, []);

    //get task list from firebase by taskListID (in EDIT task list)
    const fetchTaskFromFirebase = async (taskID, taskListID) => {
        const dbref = ref(db, '/tasks/' + taskListID + "/" + taskID);
        get(dbref).then((snapshot) => {
          if (snapshot.exists()) {
            var val = snapshot.val();
            setText(val["text"]);
            setDay(val["day"]);
            setReminder(val["reminder"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
          }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault()

        //validation
        if(!text) {
            alert(t('please_add_task'))
            return
        }

        //call the TaskListDetails.js
        onAddTask( taskListID, { created, createdBy, text, day, reminder })

        //clear the form
        if(taskID == null) {
            setText('')
            setDay('')
            setReminder(false)
        }
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>{t('task_name')}</label>
                <input type='text' placeholder={t('task_name')} value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div className='form-control'>
                <label>{t('day_and_time')}</label>
                <input type='text' placeholder={t('day_and_time')} value={day} onChange={(e) => setDay(e.target.value)} />
            </div>
            <div className='form-control form-control-check'>
                <label>{t('set_reminder')}</label>
                <input type='checkbox'
                checked={reminder}
                value={reminder} 
                onChange={(e) => setReminder(e.currentTarget.checked)} />
            </div>
            <input type='submit' value={t('button_save_task')} className='btn btn-block' />
        </form>
    )
}

export default AddTask
