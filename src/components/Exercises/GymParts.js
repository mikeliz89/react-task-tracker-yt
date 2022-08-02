//react
import { useTranslation } from 'react-i18next';
//firebase
import { ref, remove } from 'firebase/database';
import { db } from '../../firebase-config';

//exercises
import GymPart from './GymPart';

function GymParts({ exerciseID, parts }) {

    //constants
    const DB_EXERCISE_PARTS = '/exercise-parts';

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    const deleteGymPart = (exerciseID, gymPartID) => {
        const dbref = ref(db, `${DB_EXERCISE_PARTS}/${exerciseID}/${gymPartID}`);
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

