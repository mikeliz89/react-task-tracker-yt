import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import { getMovementCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
import Icon from '../Icon';

export default function Movement({ movement, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_EXERCISES });

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    {movement.name}
                </span>
                <Icon className={Constants.CLASSNAME_DELETEBTN} name={Constants.ICON_DELETE}
                    color={Constants.COLOR_DELETEBUTTON} fontSize='1.2em' cursor='pointer'
                    onClick={() => { if (window.confirm(t('delete_exercise_confirm_message'))) { onDelete(movement.id); } }}
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