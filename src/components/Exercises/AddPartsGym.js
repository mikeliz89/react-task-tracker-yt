//react
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
//buttons
import Button from '../Button';
//exercise
import AddPartsGymForm from './AddPartsGymForm';
import GymParts from './GymParts';
//firebase
import { onValue, push, child, ref } from 'firebase/database';
import { db } from '../../firebase-config';

const AddPartsGym = () => {

  const DB_EXERCISE_PARTS = '/exercise-parts';

  //params
  const params = useParams();

  //translation  
  const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

  //states
  const [showAddGymPart, setShowAddGymPart] = useState(false);
  const [parts, setParts] = useState({});

  //load data
  useEffect(() => {
    const getParts = async () => {
      await fetchPartsFromFirebase();
    }
    getParts();
  }, [])


  /** Fetch Gym Parts From Firebase */
  const fetchPartsFromFirebase = async () => {
    const dbref = await child(ref(db, DB_EXERCISE_PARTS), params.id);
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      for (let id in snap) {
        fromDB.push({ id, ...snap[id] });
      }
      setParts(fromDB);
    })
  }

  const addPart = async (exerciseID, part) => {
    const dbref = child(ref(db, DB_EXERCISE_PARTS), exerciseID);
    push(dbref, part);
  }

  return (
    <div>
      <h4>{t('gym_parts_header')}</h4>
      <Button text={t('gym_parts_add_button')} onClick={() => setShowAddGymPart(!showAddGymPart)} />
      {showAddGymPart && <AddPartsGymForm exerciseID={params.id} onAddPart={addPart} />}
      {parts != null && parts.length > 0 ?
        (<div><GymParts parts={parts} /></div>) :
        (<div>{t('gym_no_parts')} </div>)
      }
    </div>
  )
}

export default AddPartsGym
