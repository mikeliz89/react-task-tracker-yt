//react
import { useTranslation } from 'react-i18next';
import { FaPlusSquare } from 'react-icons/fa';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
//Star rating
import StarRating from '../StarRating/StarRating';
//firebase
import { ref, push } from "firebase/database";
import { db } from '../../firebase-config';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getDrinkCategoryNameByID } from '../../utils/ListUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
//alert
import Alert from '../Alert';
//icon
import Icon from '../Icon';

const Drink = ({ drink, onDelete }) => {

    const DB_DRINK_HISTORY = '/drinkhistory';

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('');
    const [showError, setShowError] = useState(false);
    const [error] = useState('');

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {t('do_drink')}
        </Tooltip>
    );

    const doDrink = (drinkID) => {
        saveDrinkHistory(drinkID);
    }

    const saveDrinkHistory = async (drinkID) => {
        const dbref = ref(db, `${DB_DRINK_HISTORY}/${drinkID}`);
        const currentDateTime = getCurrentDateAsJson();
        const userID = currentUser.uid;
        push(dbref, { currentDateTime, userID });
    }

    return (
        <div className='drink'>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            <h5>
                <span>
                    <Icon name='glass-martini' />
                    {drink.title}
                </span>
                <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_drink_confirm_message'))) { onDelete(drink.id); } }} />
            </h5>
            {drink.category !== "" ? (
                <p> {'#' + t('category_' + getDrinkCategoryNameByID(drink.category))}</p>
            ) : ('')}
            <p>{drink.description}</p>
            <p>
                <Link className='btn btn-primary' to={`/drink/${drink.id}`}>{t('view_details')}</Link>
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <span style={{ marginLeft: '5px' }}>
                        <FaPlusSquare style={{ cursor: 'pointer', marginRight: '5px', fontSize: '1.2em' }}
                            onClick={() => { if (window.confirm(t('do_drink_confirm'))) { doDrink(drink.id) } }} />
                    </span>
                </OverlayTrigger>
            </p>
            <StarRating starCount={drink.stars} />
        </div>
    )
}

export default Drink