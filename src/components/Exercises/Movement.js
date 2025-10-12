import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import { getMovementCategoryNameByID } from '../../utils/ListUtils';
import { TRANSLATION } from '../../utils/Constants';
import DeleteButton from '../Buttons/DeleteButton';

export default function Movement({ movement, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    {movement.name}
                </span>
                <DeleteButton
                    onDelete={onDelete}
                    id={movement.id}
                />
            </h5>
            <p>
                {movement.category > 0 ?
                    (<span> {
                        '#' + t('movementcategory_' + getMovementCategoryNameByID(movement.category))
                    }</span>) : ('')}
            </p>
            <p>
                {movement.description}
            </p>
            <p>
                <Link className='btn btn-primary' to={`/movement/${movement.id}`}>{t('view_movement_details')}</Link>
            </p>
            <StarRating starCount={movement.stars} />
        </div>
    )
}