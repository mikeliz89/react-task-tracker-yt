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
//pagetitle
import PageTitle from '../PageTitle';

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
      <PageTitle title={t('title_gym')} iconName='dumbbell' />
      <Button
        iconName='burn'
        color={showAddGymPart ? 'red' : 'steelblue'}
        text={showAddGymPart ? t('close') : t('gym_parts_add_button')}
        onClick={() => setShowAddGymPart(!showAddGymPart)} />
      {showAddGymPart &&
        <AddPartsGymForm exerciseID={params.id} onSave={addPart} onClose={() => setShowAddGymPart(false)} />
      }
      {parts != null && parts.length > 0 ?
        (<div><GymParts exerciseID={params.id} parts={parts} /></div>) :
        (<div>{t('gym_no_parts')} </div>)
      }
    </div>
  )
}

export default AddPartsGym
