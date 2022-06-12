import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
//firebase
import { ref, get } from "firebase/database";
import { db } from '../../firebase-config';
//buttons
import Button from '../../components/Button'

export default function EditWorkPhase({ recipeID, workPhaseID, onEditWorkPhase, onCloseEditWorkPhase }) {

    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    //states
    const [estimatedLength, setEstimatedLength] = useState(0)
    const [name, setName] = useState('')

    useEffect(() => {

        if (recipeID != null) {
            const getWorkPhase = async () => {
                await fetchWorkPhaseFromFirebase(recipeID)
            }
            getWorkPhase()
        }
    }, [recipeID]);

    /** Fetch Work Phase From Firebase By RecipeID and WorkPhaseID */
    const fetchWorkPhaseFromFirebase = async (recipeID) => {
        const dbref = ref(db, '/workphases/' + recipeID + "/" + workPhaseID);
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setName(val["name"]);
                setEstimatedLength(val["estimatedLength"]);
            }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let workPhase = { id: workPhaseID, estimatedLength, name };
        onEditWorkPhase(workPhase);
    }

    const close = (e) => {
        onCloseEditWorkPhase();
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="workPhaseName">
                <Form.Control type='text'
                    placeholder={t('workphase_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="workPhaseEstimatedLength">
                <Form.Control type='number'
                    placeholder={t('workphase_estimated_length')}
                    value={estimatedLength}
                    onChange={(e) => setEstimatedLength(e.target.value)} />
            </Form.Group>
            <Row>
                <ButtonGroup>
                    <Button type='button' text='Sulje' className='btn btn-block' onClick={() => close()} />
                    <Button type='submit' text={t('incredient_save_button_text')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}
