//react
import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const Task = ({ taskListID, archived, task, onDelete, onToggle }) => {

    //translation
    const { t } = useTranslation('tasklist', { keyPrefix: 'tasklist' });

    return (
        <div
            onDoubleClick={() => archived ? null : onToggle(taskListID, task.id)}
            className={`task ${task.reminder ? 'reminder' : ''}`}>
            <h5>
                - {task.text}
                {archived ? null :
                    <> <FaTimes className="deleteBtn"
                        style={{ color: 'red', cursor: 'pointer', fontSize: '1.4em' }}
                        onClick={() => onDelete(taskListID, task.id)} />
                    </>
                }
            </h5>
            <p>{task.day}</p>
            { /* TODO: Rakenna view details arkiston taskin katselulle? */
                archived ? null :
                    <>
                        <p><Link className="btn btn-primary" to={`/task/${task.id}/${taskListID}`}>{t('view_details')}</Link></p>
                    </>
            }
        </div>
    )
}

export default Task
