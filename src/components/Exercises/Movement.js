import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TRANSLATION, NAVIGATION } from '../../utils/Constants';
import { getMovementCategoryNameByID } from '../../utils/ListUtils';
import DeleteButton from '../Buttons/DeleteButton';

import StarRating from '../StarRating/StarRating';
import ListRow from '../Site/ListRow';

export default function Movement({ movement, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });

    return (
        <ListRow
            headerTitle={
                <Link
                    style={{ textDecoration: 'none' }}
                    to={`${NAVIGATION.MOVEMENT}/${movement.id}`}>{movement.name}</Link>
            }
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={movement.id}
            starCount={movement.stars}
        >
            <p>
                {movement.category > 0 ?
                    (<span> {'#' + t('movementcategory_' + getMovementCategoryNameByID(movement.category))}</span>) : ('')}
            </p>
            <p>{movement.description}</p>
        </ListRow>
    );
}


