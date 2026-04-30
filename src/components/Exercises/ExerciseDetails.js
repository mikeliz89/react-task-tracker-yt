import i18n from "i18next";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseById } from "../../datatier/datatier";
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import { getExerciseCategoryNameByID } from "../../utils/ListUtils";
import Alert from "../Alert";
import CommentComponent from "../Comments/CommentComponent";
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import ImageComponent from "../ImageUpload/ImageComponent";
import LinkComponent from "../Links/LinkComponent";
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

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: exercise, loading } = useFetch(DB.EXERCISES, "", params.id);

    const addCommentToExercise = async (comment) => {
        let id = params.id;
        comment["created"] = getCurrentDateAsJson()
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.EXERCISE_COMMENTS, id, comment);
    }

    const addLinkToExercise = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.EXERCISE_LINKS, id, link);
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
            title={<PageTitle title={t('exercisedetails')} />}
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
            alertSection={
                <Alert
                    message={message}
                    showMessage={showMessage}
                    error={error}
                    showError={showError}
                    onClose={clearMessages}
                />
            }
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
            imageSection={<ImageComponent objID={params.id} url={DB.EXERCISE_IMAGES} />}
            commentSection={<CommentComponent objID={params.id} url={DB.EXERCISE_COMMENTS} onSave={addCommentToExercise} />}
            linkSection={<LinkComponent objID={params.id} url={DB.EXERCISE_LINKS} onSaveLink={addLinkToExercise} />}
        />
    )
}

function showAddMoving(exercise) {
    return Number(exercise.category) === Categories.BikingInside ||
        Number(exercise.category) === Categories.Biking ||
        Number(exercise.category) === Categories.Kayaking ||
        Number(exercise.category) === Categories.Running ||
        Number(exercise.category) === Categories.Walking ||
        Number(exercise.category) === Categories.Skiing;
}



