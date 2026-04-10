


//translation


import { onValue, child, ref } from 'firebase/database';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { pushToFirebaseChild } from '../../datatier/datatier';
import { db } from '../../firebase-config';
import { TRANSLATION, DB, ICONS, COLORS } from '../../utils/Constants';
import Button from '../Buttons/Button';
import PageTitle from '../Site/PageTitle';

import AddPartsGymForm from './AddPartsGymForm';
import GymParts from './GymParts';

export default function AddPartsGym() {

  //params
  const params = useParams();
const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });

  //states
  const [showAddGymPart, setShowAddGymPart] = useState(false);
  const [parts, setParts] = useState({});

  //load data
  useEffect(() => {
    const dbref = child(ref(db, DB.EXERCISE_PARTS), params.id);
    const unsubscribe = onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      if (snap != null) {
        for (let id in snap) {
          fromDB.push({ id, ...snap[id] });
        }
      }
      setParts(fromDB);
    });

    return () => {
      unsubscribe();
    };
  }, [params.id]);

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


