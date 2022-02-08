import { FaTimes} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const TaskList = ({taskList, onDelete}) => {

    return (
        <div className="task">
            <h3>
            {taskList.title} <FaTimes className="deleteTaskBtn" style={{color:'red', cursor: 'pointer'}} 
            onClick={() => onDelete(taskList.id)} />
            </h3>
            <p>{taskList.description}</p>
            <p><Link to={`/tasklist/${taskList.id}`}>View Details</Link></p>
        </div>
    )
}

export default TaskList
