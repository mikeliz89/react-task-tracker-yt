import { ref, child, onValue } from 'firebase/database';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { db } from '../../firebase-config';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Button from '../Buttons/Button';
import PageTitle from '../Site/PageTitle';

export default function AddPartsMoving({ title, iconName }) {

  //states
  const [distance, setDistance] = useState(0);
const [time, setTime] = useState(0);
  const [partID, setPartID] = useState();
  const [loading, setLoading] = useState(true);

  //user
  const { currentUser } = useAuth();

  //params
  const params = useParams();

  //translation  
  const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

  //load data
  useEffect(() => {
    const dbref = child(ref(db, DB.EXERCISE_PARTS), params.id);
    const unsubscribe = onValue(dbref, (snapshot) => {
      const val = snapshot.val();
      const fromDB = [];
      if (val === null) {
        setLoading(false);
        return;
      }
      for (let id in val) {
        fromDB.push({ id, ...val[id] });
      }
      if (fromDB && fromDB.length > 0) {
        setPartID(fromDB[0]["id"]);
        setDistance(fromDB[0]["distance"]);
        setTime(fromDB[0]["time"]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [params.id]);

  const onSubmit = (e) => {
    e.preventDefault();

    const moving = { distance, time };
    if (!partID) {
      save(moving);
    } else {
      moving["id"] = partID;
      updateMoving(moving, partID);
    }
  }

  const updateMoving = async (moving, partID) => {
    const exerciseID = params.id;
    moving["modified"] = getCurrentDateAsJson();
    updateToFirebaseByIdAndSubId(DB.EXERCISE_PARTS, exerciseID, partID, moving);
  }

  const save = async (moving) => {
    const exerciseID = params.id;
    moving["created"] = getCurrentDateAsJson();
    moving["createdBy"] = currentUser.email;
    pushToFirebaseChild(DB.EXERCISE_PARTS, exerciseID, moving);
  }

  return (
    loading ? (
      <h3>{tCommon("loading")}</h3>
    ) : (
      <div>
        <PageTitle title={t(title)} iconName={iconName} />
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>{t('distance')}</Form.Label>
            <Form.Control type='number'
              value={distance}
              onChange={(e) => setDistance(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('time')}</Form.Label>
            <Form.Control type='text'
              value={time}
              onChange={(e) => setTime(e.target.value)}></Form.Control>
          </Form.Group>
          <Button disabled={loading} type='submit' text={tCommon('buttons.button_save')} />
        </Form>
      </div>
    )
  )
}

AddPartsMoving.defaultProps = {
  title: 'title_missing',
  iconName: ''
}

AddPartsMoving.propTypes = {
  title: PropTypes.string,
  iconName: PropTypes.string
}


