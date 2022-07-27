//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../Button';
//backpacking
import { GearCategories } from './Categories';

const AddGear = ({ gearID, onAddGear, onClose }) => {

    const DB_GEAR = "/backpacking-gear";

    //translation
    const { t } = useTranslation('backpacking', { keyPrefix: 'backpacking' });

    //states
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState(GearCategories);
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [weightInGrams, setWeightInGrams] = useState(0);

    //load data
    useEffect(() => {
        if (gearID != null) {
            const getGear = async () => {
                await fetchGearFromFirebase(gearID);
            }
            getGear();
        }
    }, [gearID]);

    useEffect(() => {
        sortCategoriesByName();
    }, []);

    const sortCategoriesByName = () => {
        const sortedCategories = [...categories].sort((a, b) => {
            const aName = t(`gear_category_${a.name}`);
            const bName = t(`gear_category_${b.name}`);
            return aName > bName ? 1 : -1;
        });
        setCategories(sortedCategories);
    }

    /** get gear from firebase by id (in EDIT gear) */
    const fetchGearFromFirebase = async (gearID) => {

        const dbref = ref(db, `${DB_GEAR}/${gearID}`);
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setCategory(val["category"]);
                setCreated(val["created"]);
                setCreatedBy(val["createdBy"]);
                setName(val["name"]);
                setWeightInGrams(val["weightInGrams"]);
            }
        });
    }

    /** Gear Form Submit */
    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_gear'));
            return;
        }

        onAddGear({ created, createdBy, name, category, weightInGrams });

        if (gearID == null) {
            //clear the form
            setName('');
            setCategory('');
            setWeightInGrams(0);
        }
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addGearForm-Name">
                    <Form.Label>{t('gear_name')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={gearID == null ? t('gear_name') : t('gear_name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addGearForm-WeightInGrams">
                    <Form.Label>{t('gear_weight_in_grams')}</Form.Label>
                    <Form.Control type='number'
                        autoComplete="off"
                        placeholder={t('gear_weight_in_grams')}
                        value={weightInGrams}
                        onChange={(e) => setWeightInGrams(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addGearForm-Category">
                    <Form.Label>{t('gear_category')}</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        {categories.map(({ id, name }) => (
                            <option value={id} key={id}>{t(`gear_category_${name}`)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type='button' text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={t('button_save_gear')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
            {/* TODO rakenna linkin lisäys jo gearin lisäykseen <AddLink onSaveLink={saveLink} /> */}
        </>
    )
}

export default AddGear