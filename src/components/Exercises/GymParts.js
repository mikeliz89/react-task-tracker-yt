import { useTranslation } from 'react-i18next';
import GymPart from './GymPart';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';

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