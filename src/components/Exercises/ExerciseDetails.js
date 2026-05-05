import i18n from "i18next";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { updateToFirebaseById } from "../../datatier/datatier";
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import { getExerciseCategoryNameByID } from "../../utils/ListUtils";
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import DetailsPage from '../Site/DetailsPage';
import PageTitle from '../Site/PageTitle';

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

    function showAddMoving(exercise) {
        return Number(exercise.category) === Categories.BikingInside ||
            Number(exercise.category) === Categories.Biking ||
            Number(exercise.category) === Categories.Kayaking ||
            Number(exercise.category) === Categories.Running ||
            Number(exercise.category) === Categories.Walking ||
            Number(exercise.category) === Categories.Skiing;
    }

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
                                <td>{t('date_and_time')}: {exercise?.date} {exercise?.time}</td>
                            </tr>
                            <tr>
                                <td>{t('end_date')}: {exercise?.endDate} {exercise?.endTime}</td>
                            </tr>
                            <tr>
                                <td>{t('duration')} : {t('coming_soon')}</td>
                            </tr>
                        </tbody>
                    </Table>

                    {
                        Number(exercise?.category) === Categories.Gym &&
                        <AddPartsGym />
                    }
                    {
                        Number(exercise?.category) === Categories.Aerobics &&
                        <AddPartsAerobics />
                    }
                    {
                        showAddMoving(exercise) &&
                        <AddPartsMoving
                            title={getTitleByCategory(exercise?.category)}
                            iconName={getIconNameByCategory(exercise?.category)}
                        />
                    }
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
