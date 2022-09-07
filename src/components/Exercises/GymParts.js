import { useTranslation } from 'react-i18next';
import { ref, remove } from 'firebase/database';
import { db } from '../../firebase-config';
import GymPart from './GymPart';
import * as Constants from '../../utils/Constants';

function GymParts({ exerciseID, parts }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

    const deleteGymPart = (exerciseID, gymPartID) => {
        const dbref = ref(db, `${Constants.DB_EXERCISE_PARTS}/${exerciseID}/${gymPartID}`);
        remove(dbref);
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

