import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import { ref, onValue, update } from "firebase/database";
import { Row, ButtonGroup } from 'react-bootstrap';
import Button from '../../components/Button';
import GoBackButton from '../../components/GoBackButton';
import i18n from "i18next";
import { FaGlassMartini } from 'react-icons/fa';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import AddDrink from './AddDrink';

export default function DrinkDetails() {

    //states
    const [loading, setLoading] = useState(true)
    const [drink, setDrink] = useState({})
    const [showAddIncredient, setShowAddIncredient] = useState(false)
    const [showAddWorkPhase, setShowAddWorkPhase] = useState(false)
    const [showEditDrink, setShowEditDrink] = useState(false)

    //other
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });
    const params = useParams();
    const navigate = useNavigate();

    //load data
    useEffect(() => {
        const getDrink = async () => {
            await fetchDrinkFromFirebase();
        }
        getDrink()
    }, [])

    /** Fetch Drink From Firebase */
    const fetchDrinkFromFirebase = async () => {
        const dbref = ref(db, '/drinks/' + params.id);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1)
            }
            setDrink(data)
            setLoading(false);
        })
    }

    
    /** Add Drink To Firebase */
    const addDrink = async (drink) => {
        var drinkID = params.id;
        //save edited drink to firebase
        const updates = {};
        drink["modified"] = getCurrentDateAsJson()
        updates[`/drinks/${drinkID}`] = drink;
        update(ref(db), updates);
    }


    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button text={showEditDrink ? t('button_close') : t('button_edit')}
                        color={showEditDrink ? 'red' : 'orange'}
                        onClick={() => setShowEditDrink(!showEditDrink)} />
                    <Button color={showAddIncredient ? 'red' : 'green'}
                        text={showAddIncredient ? t('button_close') : t('button_add_incredient')}
                        onClick={() => setShowAddIncredient(!showAddIncredient)} />
                    <Button color={showAddWorkPhase ? 'red' : 'green'}
                        text={showAddWorkPhase ? t('button_close') : t('button_add_workphase')}
                        onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
                </ButtonGroup>
            </Row>
            <h4 className="page-title">
                <FaGlassMartini style={{ color: 'gray', cursor: 'pointer', marginBottom: '3px' }} /> {drink.title}
            </h4>
            <div className="page-content">
                {/* <pre>{JSON.stringify(recipe)}</pre> */}
                <p>{drink.description}</p>
                <p>
                    {t('created')}: {getJsonAsDateTimeString(drink.created, i18n.language)}<br />
                    {t('created_by')}: {drink.createdBy}<br />
                    {t('modified')}: {getJsonAsDateTimeString(drink.modified, i18n.language)}<br />
                    {t('category')}: {drink.category}
                </p>
                {showEditDrink && <AddDrink onAddDrink={addDrink} drinkID={params.id} />}
            </div>
        </div>
    )
}
