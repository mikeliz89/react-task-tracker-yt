import i18n from "i18next";
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getDrinkingProductCategoryNameByID } from '../../utils/ListUtils';

import Alert from '../Alert';
import CommentComponent from '../Comments/CommentComponent';
import useFetch from '../Hooks/useFetch';
import { useAlert } from '../Hooks/useAlert';
import { useToggle } from '../Hooks/useToggle';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import DetailsPage from '../Site/DetailsPage';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';

import AddDrinkingProduct from './AddDrinkingProduct';

export default function DrinkingProductDetails() {

    //params
    const params = useParams();

    //modal
    const { status: showEditDrinkingProduct, toggleStatus: toggleSetShowEdit } = useToggle();

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showFailure
    } = useAlert();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });

    //fetch data
    const { data: drinkingProduct, loading } = useFetch(DB.DRINKINGPRODUCTS, "", params.id);

    //auth
    const { currentUser } = useAuth();

    const addCommentToDrinkingProduct = (comment) => {
        const drinkID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.DRINKINGPRODUCT_COMMENTS, drinkID, comment);
    }

    const addLinkToDrinkingProduct = (link) => {
        const drinkID = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.DRINKINGPRODUCT_LINKS, drinkID, link);
    }

    const addDrinkingProduct = async (drinkingProduct) => {
        try {
            const drinkingProductID = params.id;
            drinkingProduct["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.DRINKINGPRODUCTS, drinkingProductID, drinkingProduct);
        } catch (error) {
            showFailure(t('failed_to_save_drink'));
            console.warn(error)
        }
    }

    const saveStars = async (stars) => {
        const drinkingProductID = params.id;
        drinkingProduct["modified"] = getCurrentDateAsJson();
        drinkingProduct["stars"] = Number(stars);
        updateToFirebaseById(DB.DRINKINGPRODUCTS, drinkingProductID, drinkingProduct);
    }

    return (
        <DetailsPage
            loading={loading}
            showEditButton={true}
            isEditOpen={showEditDrinkingProduct}
            onToggleEdit={toggleSetShowEdit}
            title={`${drinkingProduct?.name || ''}${Number(drinkingProduct?.abv) > 0 ? ` (${drinkingProduct?.abv}%)` : ''}`}
            titleSuffix={
                <span className={`details-pill ${drinkingProduct?.haveAtHome === true ? 'details-pill-ready' : 'details-pill-not-ready'}`}>
                    {drinkingProduct?.haveAtHome === true ? t('drinkingproduct_have_at_home') : t('drinkingproduct_not_have_at_home')}
                </span>
            }
            preSummaryContent={
                <>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('category')}:</span>{' '}
                        <span className="detailspage-meta-value">{t(`drinkingproduct_category_${getDrinkingProductCategoryNameByID(drinkingProduct?.category)}`)}</span>
                    </div>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('drinkingproduct_amount')}:</span>{' '}
                        <span className="detailspage-meta-value">{drinkingProduct?.amount || '-'}</span>
                    </div>
                </>
            }
            summary={`${t('description')}: ${drinkingProduct?.description || '-'}`}
            ratingSection={<StarRatingWrapper stars={drinkingProduct?.stars} onSaveStars={saveStars} />}
            metaItems={[
                {
                    id: 1,
                    content: <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(drinkingProduct?.created, i18n.language)}</span></>
                },
                {
                    id: 2,
                    content: <><span className="detailspage-meta-label">{t('created_by')}:</span> <span className="detailspage-meta-value">{drinkingProduct?.createdBy || '-'}</span></>
                },
                {
                    id: 3,
                    content: <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(drinkingProduct?.modified, i18n.language)}</span></>
                }
            ]}
            editModalTitle={t('modal_header_edit_drinking_product')}
            editSection={
                <AddDrinkingProduct
                    onAddDrinkingProduct={addDrinkingProduct}
                    drinkingProductID={params.id}
                    onClose={toggleSetShowEdit}
                />
            }
            alertSection={
                <Alert
                    message={message}
                    showMessage={showMessage}
                    error={error}
                    showError={showError}
                    onClose={clearMessages}
                />
            }
            imageSection={<ImageComponent url={DB.DRINKINGPRODUCT_IMAGES} objID={params.id} />}
            commentSection={<CommentComponent objID={params.id} url={DB.DRINKINGPRODUCT_COMMENTS} onSave={addCommentToDrinkingProduct} />}
            linkSection={<LinkComponent objID={params.id} url={DB.DRINKINGPRODUCT_LINKS} onSaveLink={addLinkToDrinkingProduct} />}
        />
    )
}
