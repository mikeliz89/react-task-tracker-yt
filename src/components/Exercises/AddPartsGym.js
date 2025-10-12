import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../Buttons/Button';
import AddPartsGymForm from './AddPartsGymForm';
import GymParts from './GymParts';
import { onValue, child, ref } from 'firebase/database';
import { db } from '../../firebase-config';
import PageTitle from '../Site/PageTitle';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { pushToFirebaseChild } from '../../datatier/datatier';

export default function AddPartsGym() {

  //params
  const params = useParams();

  //translation  
  const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });

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
    const dbref = await child(ref(db, DB.EXERCISE_PARTS), params.id);
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
    pushToFirebaseChild(DB.EXERCISE_PARTS, exerciseID, part);
  }

  const copyLast = () => {
    const lastPart = parts[parts.length - 1];
    delete (lastPart["id"]);
    addPart(params.id, lastPart);
  }

  return (
    <div>
      <PageTitle title={t('title_gym')} iconName={ICONS.DUMBBELL} />
      <Button
        iconName={ICONS.BURN}
        color={showAddGymPart ? COLORS.RED : COLORS.STEELBLUE}
        text={showAddGymPart ? t('close') : t('gym_parts_add_button')}
        onClick={() => setShowAddGymPart(!showAddGymPart)} />
      {showAddGymPart &&
        <AddPartsGymForm exerciseID={params.id} onSave={addPart} onClose={() => setShowAddGymPart(false)} />
      }
      {parts != null && parts.length > 0 ?
        (
          <div>
            <GymParts exerciseID={params.id} parts={parts} />
            <Button text={t('copy_last')} onClick={copyLast} />
          </div>
        ) :
        (
          <div>{t('gym_no_parts')} </div>
        )
      }
    </div>
  )
}