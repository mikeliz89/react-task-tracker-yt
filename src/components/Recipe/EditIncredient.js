import Button from '../../components/Button'
import { Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
import { useTranslation } from 'react-i18next';

export default function EditIncredient({recipeID, incredientID, onEditIncredient}) {

    const { t } = useTranslation();
    
    //states
    const [name, setName] = useState('')
    const [amount, setAmount] = useState(0)
    const [unit, setUnit] = useState('')

    useEffect(() => {

        if(recipeID != null) {            
            const getIncredient = async () => {
                await fetchIncredientFromFirebase(recipeID)
            }
            getIncredient()
            }
      }, [recipeID]);

    /** Fetch Incredient From Firebase By RecipeID */
    const fetchIncredientFromFirebase = async (recipeID) => {
        const dbref = ref(db, '/incredients/' + recipeID + "/" + incredientID);
        get(dbref).then((snapshot) => {
          if (snapshot.exists()) {
            var val = snapshot.val();
            setName(val["name"]);
            setUnit(val["unit"]);
            setAmount(val["amount"]);
          }
        });
    }
    
    const onSubmit = (e) => {
        e.preventDefault();
        let incredient = {id:incredientID, name, amount, unit};
        onEditIncredient(incredient);
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="incredientName">
                <Form.Control type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="incredientAmount">
                <Form.Control type='number'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="incredientUnit">
                <Form.Control type='text'
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)} />
            </Form.Group>
            <Button type='submit' text={t('incredient_save_button_text')} className='btn btn-block' />
        </Form>
    )
}
