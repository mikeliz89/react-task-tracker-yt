//react
import { useTranslation } from 'react-i18next';
import { FaTimes, FaPlusSquare, FaGlassMartini } from 'react-icons/fa';
import { OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
//Star rating
import StarRating from '../StarRating';
//firebase
import { ref, push, onValue, remove } from "firebase/database";
import { db } from '../../firebase-config';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';

const Drink = ({ drink, onDelete }) => {

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //states
    const [message, setMessage] = useState('')
    const [showMessage, setShowMessage] = useState(false);
    const [error, showError] = useState(false);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {t('do_drink')}
        </Tooltip>
    );

    const doDrink = (drinkID) => {
        saveDrinkHistory(drinkID);
    }

    const saveDrinkHistory = async (drinkID) => {
        const dbref = ref(db, '/drinkhistory/' + drinkID);
        const currentDateTime = getCurrentDateAsJson();
        const userID = currentUser.uid;
        push(dbref, { currentDateTime, userID });

        setShowMessage(true);
        setMessage("Tallennus onnistui");
    }

    return (
        <div key={drink.id} className='recipe'>
            {error && <div className="error">{error}</div>}
            {message &&
                <Alert show={showMessage} variant='success'>
                    {message}
                    <div className='d-flex justify-content-end'>
                        <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
                    </div>
                </Alert>}
            <h5>
                <span>
                    <FaGlassMartini style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
                    {drink.title}
                </span>
                <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_drink_confirm_message'))) { onDelete(drink.id); } }} />
            </h5>
            {drink.category !== "" ? (<p> {'#' + drink.category}</p>) : ('')}
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