import { FaTimes} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const Task = ({taskListID, archived, task, onDelete, onToggle}) => {
    const { t } = useTranslation();
    return (
        <div 
         onDoubleClick={() => archived ? null : onToggle(taskListID, task.id)} 
         className={`task ${task.reminder ? 'reminder' : ''}`}>
            <h4>
            - {task.text}
                { archived ? null : 
            <> <FaTimes className="deleteTaskBtn" style={{color:'red', cursor: 'pointer'}} 
                onClick={() => onDelete(taskListID, task.id)} />
            </>
            }
            </h4>
            <p>{task.day}</p>
            { /* TODO: Rakenna view details arkiston taskin katselulle? */
             archived ? null : 
            <>
            <p><Link to={`/task/${task.id}/${taskListID}`}>{t('view_details')}</Link></p>
            </>
            }
        </div>
    )
}

export default Task
