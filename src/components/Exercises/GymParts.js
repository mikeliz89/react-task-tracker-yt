import { useTranslation } from 'react-i18next';

import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';

import GymPart from './GymPart';

export default function GymParts({ exerciseID, parts }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });

    const deleteGymPart = (exerciseID, gymPartID) => {
        removeFromFirebaseByIdAndSubId(DB.EXERCISE_PARTS, exerciseID, gymPartID);
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


