import { useState, useEffect } from 'react'
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
import { useTranslation } from 'react-i18next';

const AddTaskList = ({taskListID, onAddTaskList}) => {

    const { t } = useTranslation();

    //states
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [created, setCreated] = useState('')
    const [createdBy, setCreatedBy] = useState('')

    useEffect(() => {

        if(taskListID != null) {            
            //Task List
            const getTaskList = async () => {
                await fetchTaskListFromFirebase(taskListID)
            }
            getTaskList()
            }
      }, []);

    //get task list from firebase by taskListID (in EDIT task list)
    const fetchTaskListFromFirebase = async (taskListID) => {

        const dbref = ref(db, '/tasklists/' + taskListID);
        get(dbref).then((snapshot) => {
          if (snapshot.exists()) {
            var val = snapshot.val();
            setTitle(val["title"]);
            setDescription(val["description"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
          }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault()

        //validation
        if(!title) {
            alert('Please add a task list')
            return
        }
       
        onAddTaskList({ created, createdBy, title, description });

        if(taskListID == null) {
            //clear the form
            setTitle('')
            setDescription('')
        }
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>{t('task_list')}</label>
                <input type='text'
                    placeholder={ taskListID == null ? t('add_task_list') : t('edit_task_list')} 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className='form-control'>
                <label>{t('description')}</label>
                <input type='text' 
                    placeholder={ taskListID == null ? t('add_description') : t('edit_description') }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} />
            </div>
            <input type='submit' value={t('button_save_list')} className='btn btn-block' />
        </form>
    )
}

export default AddTaskList
