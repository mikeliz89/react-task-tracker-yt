import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import StarRating from '../StarRating';
import { FaTimes, FaUtensils, FaShoppingCart } from 'react-icons/fa';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { db } from '../../firebase-config';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAuth } from '../../contexts/AuthContext';
import { ref, push, child } from "firebase/database";

const Recipe = ({ recipe, onDelete }) => {

    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {t('shopcart_tooltip')}
        </Tooltip>
    );

    const makeShoppingList = () => {
        addTaskList({ title: `${t('shoppinglist')} ${getCurrentDateAsJson()}` });
        navigate('/managetasklists')
    }

    const addTaskList = async (taskList) => {
        taskList["created"] = getCurrentDateAsJson();
        taskList["createdBy"] = currentUser.email;
        const dbref = ref(db, '/tasklists');

        push(dbref, taskList)
            .then((snap) => {
                addTasksToTaskList(snap.key)
            })
    }

    const addTasksToTaskList = async (tasklistID) => {
        //Todo: kaiva tässä reseptin kaikki incredientit ja tee niistä add taskeja
        addTask(tasklistID, { text: 'text', 'day': 'text2', 'reminder': false })
    }

    const addTask = async (taskListID, task) => {
        //To firebase
        task["created"] = getCurrentDateAsJson()
        task["createdBy"] = currentUser.email;
        const dbref = child(ref(db, '/tasks'), taskListID);
        push(dbref, task);
    }

    return (
        <div key={recipe.id} className={recipe.isCore === true ? 'recipe coreRecipe' : 'recipe'}>
            <h5>
                <span>
                    <FaUtensils style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
                    {recipe.title}
                </span>
                <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_recipe_confirm_message'))) { onDelete(recipe.id); } }} />
            </h5>
            {recipe.category !== "" ? (<p> {'#' + recipe.category}</p>) : ('')}
            <p>{recipe.description}</p>
            <p>
                <Link className='btn btn-info' to={`/recipe/${recipe.id}`}>{t('view_details')}</Link>
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <span style={{ marginLeft: '5px' }}>
                        <FaShoppingCart style={{ cursor: 'pointer', marginRight: '5px', fontSize: '1.2em' }}
                            onClick={() => { if (window.confirm(t('create_shoppinglist_confirm_message'))) { makeShoppingList() } }} />
                    </span>
                </OverlayTrigger>
            </p>
            <StarRating starCount={recipe.stars} />
        </div>
    )
}

export default Recipe