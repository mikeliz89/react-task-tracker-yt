//react
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
//star rating
import StarRating from '../StarRating/StarRating';
//utils
import { getMovementCategoryNameByID } from '../../utils/ListUtils';
//icon
import Icon from '../Icon';

const Movement = ({ movement, onDelete }) => {

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    return (
        <div key={movement.id} className='exercise'>
            <h5>
                <span>
                    {
                        movement.name
                    }
                </span>
                <Icon className='deleteBtn' name='times' color='red' fontSize='1.2em' cursor='pointer'
                    onClick={() => { if (window.confirm(t('delete_exercise_confirm_message'))) { onDelete(movement.id); } }} />

            </h5>
            <p>
                {movement.category > 0 ?
                    (<span> {
                        '#' + t('movementcategory_' + getMovementCategoryNameByID(movement.category))
                    }</span>) : ('')}
            </p>
            <p>
                <Link className='btn btn-primary' to={`/movement/${movement.id}`}>{t('view_movement_details')}</Link>
            </p>
            <StarRating starCount={movement.stars} />
        </div>
    )
}

export default Movement