import { useState, useEffect } from 'react'
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";

const AddTask = ({taskID, taskListID, onAddTask}) => {
    //states
    const [text, setText] = useState('')
    const [day, setDay] = useState('')
    const [reminder, setReminder] = useState(false)

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
          }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault()

        //validation
        if(!text) {
            alert('Please add a task')
            return
        }

        //call the TaskListDetails.js
        onAddTask( taskListID, { text, day, reminder })

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
                <label>Task</label>
                <input type='text' placeholder='Add Task' value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div className='form-control'>
                <label>Day & Time</label>
                <input type='text' placeholder='Add Day & Time' value={day} onChange={(e) => setDay(e.target.value)} />
            </div>
            <div className='form-control form-control-check'>
                <label>Set Reminder</label>
                <input type='checkbox'
                checked={reminder}
                value={reminder} 
                onChange={(e) => setReminder(e.currentTarget.checked)} />
            </div>
            <input type='submit' value='Save Task' className='btn btn-block' />
        </form>
    )
}

export default AddTask
