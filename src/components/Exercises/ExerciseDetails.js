import i18n from "i18next";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { TRANSLATION, DB } from '../../utils/Constants';
import { getJsonAsDateTimeString, getJsonAsDateString } from "../../utils/DateTimeUtils";
import { getExerciseCategoryNameByID } from "../../utils/ListUtils";
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import DetailsPage from '../Site/DetailsPage';

import AddPartsAerobics from "./AddPartsAerobics";
import AddPartsGym from "./AddPartsGym";
import AddPartsMoving from "./AddPartsMoving";
import { Categories, getTitleByCategory, getIconNameByCategory } from './Categories';
import EditExercise from "./EditExercise";

export default function ExerciseDetails() {

    //params
    const params = useParams();

    //states
    const [showEditExercise, setShowEditExercise] = useState(false);

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages
    } = useAlert();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });

    //fetch data
    const { data: exercise, loading } = useFetch(DB.EXERCISES, "", params.id);

    function showAddMoving(category) {
        const movingCategories = [
            Categories.BikingInside,
            Categories.Biking,
            Categories.Kayaking,
            Categories.Running,
            Categories.Walking,
            Categories.Skiing,
        ];

        return movingCategories.includes(Number(category));
    }

    const category = Number(exercise?.category);
    const showGymParts = category === Categories.Gym;
    const showAerobicsParts = category === Categories.Aerobics;
    const showMovingParts = showAddMoving(category);

    return (
        <DetailsPage
            item={exercise}
            id={params.id}
            dbKey={DB.EXERCISES}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEditExercise}
            onToggleEdit={() => setShowEditExercise(!showEditExercise)}
            title={t('exercisedetails')}
            preSummaryContent={
                <div className="detailspage-field">
                    <span className="detailspage-meta-label">{t('category')}:</span>{' '}
                    <span className="detailspage-meta-value">{t(`category_${getExerciseCategoryNameByID(exercise?.category)}`)}</span>
                </div>
            }
            summary={`${t('description')}: ${exercise?.description || '-'}`}
            metaItems={[
                {
                    id: 1,
                    content: <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(exercise?.created, i18n.language)}</span></>
                },
                {
                    id: 2,
                    content: <><span className="detailspage-meta-label">{t('created_by')}:</span> <span className="detailspage-meta-value">{exercise?.createdBy || '-'}</span></>
                },
                {
                    id: 3,
                    content: <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(exercise?.modified, i18n.language)}</span></>
                }
            ]}
            editSection={<EditExercise exerciseID={params.id} exercise={exercise} onClose={() => setShowEditExercise(false)} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages
            }}
            preImageSection={
                <>
                    <Table>
                        <tbody>
                            <tr>
                                <td>{t('date_and_time')}: {getJsonAsDateString(exercise?.date, i18n.language)}{exercise?.time ? ` ${exercise.time}` : ''}</td>
                            </tr>
                            <tr>
                                <td>{t('end_date')}: {getJsonAsDateString(exercise?.endDate, i18n.language)}{exercise?.endTime ? ` ${exercise.endTime}` : ''}</td>
                            </tr>
                            <tr>
                                <td>{t('duration')} : {t('coming_soon')}</td>
                            </tr>
                        </tbody>
                    </Table>

                    {showGymParts && <AddPartsGym />}
                    {showAerobicsParts && <AddPartsAerobics />}
                    {showMovingParts && (
                        <AddPartsMoving
                            title={getTitleByCategory(category)}
                            iconName={getIconNameByCategory(category)}
                        />
                    )}
                </>
            }
            imageProps={{
                showImage: true,
                imageUrl: DB.EXERCISE_IMAGES
            }}
            commentProps={{
                showComment: true,
                commentUrl: DB.EXERCISE_COMMENTS
            }}
            linkProps={{
                showLink: true,
                linkUrl: DB.EXERCISE_LINKS
            }}
        />
    )
}
