import { useState } from 'react'

const AddTaskList = ({onAddTaskList}) => {
    //states
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()

        //validation
        if(!title) {
            alert('Please add a task list')
            return
        }

        //call the App.js
        onAddTaskList( { title, description })

        //clear the form
        setTitle('')
        setDescription('')
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Task List</label>
                <input type='text' placeholder='Add Task List' value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className='form-control'>
                <label>Description</label>
                <input type='text' placeholder='Add Description' value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <input type='submit' value='Save Task List' className='btn btn-block' />
        </form>
    )
}

export default AddTaskList
