import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../Button';
import AddPartsGymForm from './AddPartsGymForm';
import GymParts from './GymParts';
import { onValue, push, child, ref } from 'firebase/database';
import { db } from '../../firebase-config';
import PageTitle from '../PageTitle';
import * as Constants from '../../utils/Constants';

const AddPartsGym = () => {

  //params
  const params = useParams();

  //translation  
  const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

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
    const dbref = await child(ref(db, Constants.DB_EXERCISE_PARTS), params.id);
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
    const dbref = child(ref(db, Constants.DB_EXERCISE_PARTS), exerciseID);
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
