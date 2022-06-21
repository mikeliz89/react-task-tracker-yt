//react
import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
//buttons
import Button from '../Button';
//firebase
import { db } from '../../firebase-config';
import { push, ref, child, update, onValue } from 'firebase/database';
//auth
import { useAuth } from '../../contexts/AuthContext';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';

const AddPartsRunning = () => {

  //states
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [partID, setPartID] = useState();
  const [loading, setLoading] = useState(true);

  //navigation
  const navigate = useNavigate();

  //user
  const { currentUser } = useAuth();

  //params
  const params = useParams();

  //load data
  useEffect(() => {
    const getExercisePart = async () => {
      await fetchExercisePartFromFirebase();
    }
    getExercisePart();
  }, [])

  /** Fetch Recipe From Firebase */
  const fetchExercisePartFromFirebase = async () => {
    const dbref = child(ref(db, '/exercise-parts'), params.id);
    console.log("fetch");
    onValue(dbref, (snapshot) => {
      const val = snapshot.val();
      const fromDB = [];
      if (val === null) {
        navigate(-1);
      }
      for (let id in val) {
        fromDB.push({ id, ...val[id] });
      }
      setPartID(fromDB[0]["id"]);
      setDistance(fromDB[0]["distance"]);
      setTime(fromDB[0]["time"]);
      setLoading(false);
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const running = { distance, time };
    if (!partID) {
      saveRunning(running);
    } else {
      running["id"] = partID;
      updateRunning(running, partID);
    }
  }

  const updateRunning = async (running, partID) => {
    const exerciseID = params.id;
    const updates = {};
    running["modified"] = getCurrentDateAsJson()
    updates[`/exercise-parts/${exerciseID}/${partID}`] = running;
    update(ref(db), updates);
  }

  const saveRunning = async (running) => {
    const exerciseID = params.id;
    running["created"] = getCurrentDateAsJson();
    running["createdBy"] = currentUser.email;
    const dbref = child(ref(db, '/exercise-parts'), exerciseID);
    push(dbref, running);
  }

  return (
    <div>
      <h4>Running steps</h4>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Matka (km)</Form.Label>
          <Form.Control type='number'
            value={distance}
            onChange={(e) => setDistance(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Aika</Form.Label>
          <Form.Control type='text'
            value={time}
            onChange={(e) => setTime(e.target.value)}></Form.Control>
        </Form.Group>
        <Button type='submit' text='Tallenna' />
      </Form>
    </div>
  )
}

export default AddPartsRunning