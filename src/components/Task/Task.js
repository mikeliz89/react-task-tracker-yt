import { FaTimes} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Task = ({taskListID, task, onDelete, onToggle}) => {
    return (
        <div onDoubleClick={() => onToggle(taskListID, task.id)} className={`task ${task.reminder ? 'reminder' : ''}`}>
            <h3>
            - {task.text} <FaTimes className="deleteTaskBtn" style={{color:'red', cursor: 'pointer'}} 
            onClick={() => onDelete(taskListID, task.id)} />
            </h3>
            <p>{task.day}</p>
            <p><Link to={`/task/${task.id}/${taskListID}`}>View Details</Link></p>
        </div>
    )
}

export default Task
