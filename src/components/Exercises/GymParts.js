import { useTranslation } from 'react-i18next';
import { ref } from 'firebase/database';
import { db } from '../../firebase-config';
import GymPart from './GymPart';
import * as Constants from '../../utils/Constants';
import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';

function GymParts({ exerciseID, parts }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

    const deleteGymPart = (exerciseID, gymPartID) => {
        removeFromFirebaseByIdAndSubId(Constants.DB_EXERCISE_PARTS, exerciseID, gymPartID);
    }

    return (
        <>
            <h5>{t('gym_parts')}</h5>
            <div>
                {parts.map((gymPart) => (
                    <GymPart key={gymPart.id} exerciseID={exerciseID} gymPart={gymPart} onDelete={deleteGymPart} />
                ))}
            </div>
        </>
    )
}

export default GymParts

