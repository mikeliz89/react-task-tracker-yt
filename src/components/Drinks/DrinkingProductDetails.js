import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, ButtonGroup, Col, Modal } from 'react-bootstrap';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import i18n from "i18next";
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getDrinkingProductCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import AddDrinkingProduct from './AddDrinkingProduct';
import Alert from '../Alert';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import LinkComponent from '../Links/LinkComponent';
import CommentComponent from '../Comments/CommentComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AccordionElement from '../AccordionElement';
import { useToggle } from '../useToggle';

export default function DrinkingProductDetails() {

    //states
    const [loading, setLoading] = useState(true);
    const [drinkingProduct, setDrinkingProduct] = useState({});

    //modal
    const { status: showEditDrinkingProduct, toggleStatus: toggleSetShowEdit } = useToggle();

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
            const drinkingProductID = params.id;
            drinkingProduct["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(Constants.DB_DRINKINGPRODUCTS, drinkingProductID, drinkingProduct);
        } catch (error) {
            console.log(error)
            setError(t('failed_to_save_drink'));
            setShowError(true);
        }
    }

    const saveStars = async (stars) => {
        const drinkingProductID = params.id;
        drinkingProduct["modified"] = getCurrentDateAsJson();
        drinkingProduct["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_DRINKINGPRODUCTS, drinkingProductID, drinkingProduct);
    }

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(drinkingProduct.created, i18n.language) },
            { id: 2, name: t('created_by'), value: drinkingProduct.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(drinkingProduct.modified, i18n.language) },
            { id: 4, name: t('category'), value: t('drinkingproduct_category_' + getDrinkingProductCategoryNameByID(drinkingProduct.category)) },
            { id: 5, name: t('drinkingproduct_amount'), value: drinkingProduct.amount }
        ];
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_EDIT}
                        text={showEditDrinkingProduct ? t('button_close') : ''}
                        color={showEditDrinkingProduct ? Constants.COLOR_EDITBUTTON_OPEN : Constants.COLOR_EDITBUTTON_CLOSED}
                        onClick={() => toggleSetShowEdit()} />
                </ButtonGroup>
            </Row>

            <AccordionElement array={getAccordionData()}
                title={drinkingProduct.name + (drinkingProduct.abv > 0 ? ' (' + drinkingProduct.abv + '%)' : '')}
                iconName={Constants.ICON_COCKTAIL}
            />

            <Row>
                <Col>
                    {t('description') + ': '}{drinkingProduct.description}
                </Col>
            </Row>

            <Row>
                <Col>
                    <StarRatingWrapper stars={drinkingProduct.stars} onSaveStars={saveStars} />
                </Col>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => {
                    setShowMessage(false); setShowError(false);
                }}
            />

            <Modal show={showEditDrinkingProduct} onHide={toggleSetShowEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_drinking_product')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddDrinkingProduct onAddDrinkingProduct={addDrinkingProduct} drinkingProductID={params.id}
                        onClose={() => toggleSetShowEdit()} />
                </Modal.Body>
            </Modal>

            <hr />

            <ImageComponent url={Constants.DB_DRINKINGPRODUCT_IMAGES} objID={params.id} />

            <CommentComponent objID={params.id} url={Constants.DB_DRINKINGPRODUCT_COMMENTS} onSave={addCommentToDrinkingProduct} />

            <LinkComponent objID={params.id} url={Constants.DB_DRINKINGPRODUCT_LINKS} onSaveLink={addLinkToDrinkingProduct} />

        </PageContentWrapper>
    )
}
