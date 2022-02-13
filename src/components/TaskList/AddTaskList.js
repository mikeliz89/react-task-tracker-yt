import { useState, useEffect } from 'react'
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";

const AddTaskList = ({taskListID, onAddTaskList}) => {
    //states
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {

        if(taskListID != null) {            
            //Task List
            const getTaskList = async () => {
                await fetchTaskListFromFirebase(taskListID)
            }
            getTaskList()
            }
      }, []);

    const fetchTaskListFromFirebase = async (taskListID) => {

        const dbref = ref(db, '/tasklists/' + taskListID);
        get(dbref).then((snapshot) => {
          if (snapshot.exists()) {
            var val = snapshot.val();
            setTitle(val["title"]);
            setDescription(val["description"]);
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

        //call function
        onAddTaskList({ title, description })

        if(taskListID == null) {
            //clear the form
            setTitle('')
            setDescription('')
        }
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Task List</label>
                <input type='text'
                    placeholder={ taskListID == null ? 'Add Task List' : 'Edit Task List'} 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className='form-control'>
                <label>Description</label>
                <input type='text' 
                    placeholder={ taskListID == null ? 'Add Description' : 'Edit Description'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} />
            </div>
            <input type='submit' value='Save Task List' className='btn btn-block' />
        </form>
    )
}

export default AddTaskList
