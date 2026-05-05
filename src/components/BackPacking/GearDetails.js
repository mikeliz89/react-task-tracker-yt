import i18n from 'i18next';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import DetailsPage from '../Site/DetailsPage';

import AddGear from './AddGear';

export default function GearDetails() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showFailure
    } = useAlert();

    //states
    const [showEdit, setShowEdit] = useState(false);

    //params
    const params = useParams();

    //fetch data
    const { data: gear, loading } = useFetch(DB.BACKPACKING_GEAR, "", params.id);

    const updateGear = async (gear) => {
        try {
            const gearID = params.id;
            gear["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.BACKPACKING_GEAR, gearID, gear);
        } catch (error) {
            showFailure(t('failed_to_save_gear'));
            console.warn(error);
        }
    }

    return (
        <DetailsPage
            item={gear}
            id={params.id}
            dbKey={DB.BACKPACKING_GEAR}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={() => setShowEdit(!showEdit)}
            title={gear?.name}
            titleSuffix={
                <span className={`details-pill ${gear?.haveAtHome === true ? 'details-pill-ready' : 'details-pill-not-ready'}`}>
                    {t('have')}: {gear?.haveAtHome === true ? t('yes') : t('no')}
                </span>
            }
            preSummaryContent={
                <>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('category')}:</span>{' '}
                        <span className="detailspage-meta-value">{t(`gear_category_${getGearCategoryNameByID(gear?.category)}`)}</span>
                    </div>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('gear_weight_in_grams')}:</span>{' '}
                        <span className="detailspage-meta-value">{gear?.weightInGrams ?? '-'}</span>
                    </div>
                </>
            }
            summary={`${t('description')}: ${gear?.description || '-'}`}
            metaItems={[
                {
                    id: 1,
                    content: <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(gear?.created, i18n.language)}</span></>
                },
                {
                    id: 2,
                    content: <><span className="detailspage-meta-label">{t('created_by')}:</span> <span className="detailspage-meta-value">{gear?.createdBy || '-'}</span></>
                },
                {
                    id: 3,
                    content: <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(gear?.modified, i18n.language)}</span></>
                }
            ]}
            editSection={<AddGear onSave={updateGear} gearID={params.id} onClose={() => setShowEdit(false)} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages,
                alertColLg: 12,
            }}
            imageProps={{
                showImage: true,
                imageUrl: DB.BACKPACKING_GEAR_IMAGES
            }}
            commentProps={{
                showComment: true,
                commentUrl: DB.BACKPACKING_GEAR_COMMENTS
            }}
            linkProps={{
                showLink: true,
                linkUrl: DB.BACKPACKING_GEAR_LINKS
            }}
        />
    )
}


