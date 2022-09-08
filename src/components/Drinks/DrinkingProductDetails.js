import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, Table, Row, ButtonGroup, Col } from 'react-bootstrap';
import { db } from '../../firebase-config';
import { ref, onValue } from "firebase/database";
import Button from '../../components/Button';
import GoBackButton from '../../components/GoBackButton';
import i18n from "i18next";
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getDrinkingProductCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
import AddComment from '../Comments/AddComment';
import Comments from '../Comments/Comments';
import AddLink from '../Links/AddLink';
import Links from '../Links/Links';
import { useAuth } from '../../contexts/AuthContext';
import AddDrinkingProduct from './AddDrinkingProduct';
import PageTitle from '../PageTitle';
import Alert from '../Alert';
import PageContentWrapper from '../PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';

export default function DrinkingProductDetails() {

    //states
    const [loading, setLoading] = useState(true);
    const [drinkingProduct, setDrinkingProduct] = useState({});
    const [showEditDrinkingProduct, setShowEditDrinkingProduct] = useState(false);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DRINKS, { keyPrefix: Constants.TRANSLATION_DRINKS });

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

    const fetchDrinkingProductFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_DRINKINGPRODUCTS}/${params.id}`);
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
        pushToFirebaseChild(Constants.DB_DRINKINGPRODUCT_COMMENTS, drinkID, comment);
    }

    const addLinkToDrinkingProduct = (link) => {
        const drinkID = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_DRINKINGPRODUCT_LINKS, drinkID, link);
    }

    const addDrinkingProduct = async (drinkingProduct) => {
        try {
            var drinkingProductID = params.id;
            drinkingProduct["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(Constants.DB_DRINKINGPRODUCTS, drinkingProductID, drinkingProduct);
        } catch (error) {
            console.log(error)
            setError(t('failed_to_save_drink'));
            setShowError(true);
        }
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName='edit'
                        text={showEditDrinkingProduct ? t('button_close') : ''}
                        color={showEditDrinkingProduct ? 'red' : 'orange'}
                        onClick={() => setShowEditDrinkingProduct(!showEditDrinkingProduct)} />
                </ButtonGroup>
            </Row>
            <Row>
                <Col>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <PageTitle title={drinkingProduct.name} iconName='cocktail' iconColor='gray' />
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
                </Col>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            <AddComment onSave={addCommentToDrinkingProduct} />
            <AddLink onSaveLink={addLinkToDrinkingProduct} />

            {showEditDrinkingProduct && <AddDrinkingProduct onAddDrinkingProduct={addDrinkingProduct} drinkingProductID={params.id}
                onClose={() => setShowEditDrinkingProduct(false)} />}

            <Comments objID={params.id} url={'drinkingproduct-comments'} />
            <Links objID={params.id} url={'drinkingproduct-links'} />

        </PageContentWrapper>
    )
}
