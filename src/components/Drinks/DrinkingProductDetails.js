//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, Table, Row, ButtonGroup } from 'react-bootstrap';
import { FaGlassMartini } from 'react-icons/fa';
//firebase
import { db } from '../../firebase-config';
import { push, ref, child, onValue, update, remove } from "firebase/database";
//buttons
import Button from '../../components/Button';
import GoBackButton from '../../components/GoBackButton';
//i18n
import i18n from "i18next";
//utils
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getDrinkingProductCategoryNameByID } from '../../utils/ListUtils';
//Comment
import AddComment from '../Comments/AddComment';
import Comments from '../Comments/Comments';
//Links
import AddLink from '../Links/AddLink';
import Links from '../Links/Links';
//auth
import { useAuth } from '../../contexts/AuthContext';
//drinks
import AddDrinkingProduct from './AddDrinkingProduct';

export default function DrinkingProductDetails() {

    //constants
    const DB_DRINKINGPRODUCTS = '/drinkingproducts';
    const DB_DRINKINGPRODUCT_COMMENTS = '/drinkingproduct-comments';
    const DB_DRINKINGPRODUCT_LINKS = '/drinkingproduct-links';

    //states
    const [loading, setLoading] = useState(true);
    const [drinkingProduct, setDrinkingProduct] = useState({});
    const [showEditDrinkingProduct, setShowEditDrinkingProduct] = useState(false);
    const [error, setError] = useState('');

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //auth
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getDrinkingProduct = async () => {
            await fetchDrinkingProductFromFirebase();
        }
        getDrinkingProduct();
    }, [])

    /** Fetch Drink From Firebase */
    const fetchDrinkingProductFromFirebase = async () => {
        const dbref = ref(db, `${DB_DRINKINGPRODUCTS}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setDrinkingProduct(data);
            setLoading(false);
        })
    }

    const addCommentToDrinkingProduct = (comment) => {
        const drinkID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        const dbref = child(ref(db, DB_DRINKINGPRODUCT_COMMENTS), drinkID);
        push(dbref, comment);
    }

    const addLinkToDrinkingProduct = (link) => {
        const drinkID = params.id;
        link["created"] = getCurrentDateAsJson();
        const dbref = child(ref(db, DB_DRINKINGPRODUCT_LINKS), drinkID);
        push(dbref, link);
    }

        /** Add Drink To Firebase */
        const addDrinkingProduct = async (drinkingProduct) => {
            try {
                var drinkingProductID = params.id;
                //save edited drink to firebase
                const updates = {};
                drinkingProduct["modified"] = getCurrentDateAsJson();
                updates[`${DB_DRINKINGPRODUCTS}/${drinkingProductID}`] = drinkingProduct;
                update(ref(db), updates);
            } catch (error) {
                setError(t('failed_to_save_drink'));
                console.log(error)
            }
        }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        showIconEdit={true}
                        text={showEditDrinkingProduct ? t('button_close') : ''}
                        color={showEditDrinkingProduct ? 'red' : 'orange'}
                        onClick={() => setShowEditDrinkingProduct(!showEditDrinkingProduct)} />
                </ButtonGroup>
            </Row>
            {/* Accordion start */}
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <h3 className="page-title">
                            <FaGlassMartini style={{ color: 'gray', cursor: 'pointer', marginBottom: '3px' }} /> {drinkingProduct.name}
                        </h3>
                    </Accordion.Header>
                    <Accordion.Body>
                        {t('description')}: {drinkingProduct.description}<br />
                        <Table striped bordered hover>
                            <tbody>
                                <tr>
                                    <td>{t('created')}</td>
                                    <td>{getJsonAsDateTimeString(drinkingProduct.created, i18n.language)}</td>
                                </tr>
                                <tr>
                                    <td>{t('created_by')}</td>
                                    <td>{drinkingProduct.createdBy}</td>
                                </tr>
                                <tr>
                                    <td>{t('modified')}</td>
                                    <td>{getJsonAsDateTimeString(drinkingProduct.modified, i18n.language)}</td>
                                </tr>
                                <tr>
                                    <td>{t('category')}</td>
                                    <td>{t('drinkingproduct_category_' + getDrinkingProductCategoryNameByID(drinkingProduct.category))}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {/* Accordion end */}
            <div className="page-content">
                {error && <div className="error">{error}</div>}

                <AddComment onSave={addCommentToDrinkingProduct} />
                <AddLink onSaveLink={addLinkToDrinkingProduct} />

                {showEditDrinkingProduct && <AddDrinkingProduct onAddDrink={addDrinkingProduct} drinkID={params.id} 
                onClose={() => setShowEditDrinkingProduct(false)} />}

                <Comments objID={params.id} url={'drinkingproduct-comments'} />
                <Links objID={params.id} url={'drinkingproduct-links'} />
            </div>
        </div>
    )
}
