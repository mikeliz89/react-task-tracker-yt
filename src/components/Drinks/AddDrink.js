import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
import Button from '../Button';
import { DrinkCategories } from './Categories';
import * as Constants from '../../utils/Constants';

const AddDrink = ({ drinkID, onSave, onClose }) => {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION_DRINKS, { keyPrefix: Constants.TRANSLATION_DRINKS });

   //states
   const [category, setCategory] = useState('');
   const [categories, setCategories] = useState(DrinkCategories);
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [glass, setGlass] = useState('');
   const [created, setCreated] = useState('');
   const [createdBy, setCreatedBy] = useState('');
   const [stars, setStars] = useState(0);
   const [isCore, setIsCore] = useState(false);

   //load data
   useEffect(() => {
      if (drinkID != null) {
         const getDrink = async () => {
            await fetchDrinkFromFirebase(drinkID);
         }
         getDrink();
      }
   }, [drinkID]);

   useEffect(() => {
      sortCategoriesByName();
   }, []);

   const sortCategoriesByName = () => {
      const sortedCategories = [...categories].sort((a, b) => {
         const aName = t(`category_${a.name}`);
         const bName = t(`category_${b.name}`);
         return aName > bName ? 1 : -1;
      });
      setCategories(sortedCategories);
   }

   const fetchDrinkFromFirebase = async (drinkID) => {

      const dbref = ref(db, `${Constants.DB_DRINKS}/${drinkID}`);
      get(dbref).then((snapshot) => {
         if (snapshot.exists()) {
            var val = snapshot.val();
            setCategory(val["category"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setDescription(val["description"]);
            setGlass(val["glass"]);
            setIsCore(val["isCore"]);
            setStars(val["stars"]);
            setTitle(val["title"]);
         }
      });
   }

   /** Drink Form Submit */
   const onSubmit = (e) => {
      e.preventDefault();

      //validation
      if (!title) {
         alert(t('please_add_drink'));
         return;
      }

      onSave({ created, createdBy, title, description, category, glass, stars, isCore });

      if (drinkID == null) {
         clearForm();
      }
   }

   const clearForm = () => {
      setTitle('');
      setDescription('');
      setGlass('');
      setIsCore(false);
   }

   return (
      <>
         <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addDrinkForm-Name">
               <Form.Label>{t('name')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={drinkID == null ? t('name') : t('name')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkForm-Description">
               <Form.Label>{t('description')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={drinkID == null ? t('description') : t('description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkForm-Glass">
               <Form.Label>{t('glass')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={drinkID == null ? t('glass') : t('glass')}
                  value={glass}
                  onChange={(e) => setGlass(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkForm-Category">
               <Form.Label>{t('category')}</Form.Label>
               <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(({ id, name }) => (
                     <option value={id} key={id}>{t(`category_${name}`)}</option>
                  ))}
               </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="AddDrinkForm-IsCore">
               <Form.Check
                  type='checkbox'
                  label={t('set_isCore')}
                  checked={isCore}
                  value={isCore}
                  onChange={(e) => setIsCore(e.currentTarget.checked)} />
            </Form.Group>
            <Row>
               <ButtonGroup>
                  <Button type='button' text={t('button_close')} className='btn btn-block'
                     onClick={() => onClose()} />
                  <Button type='submit' text={t('button_save_drink')} className='btn btn-block saveBtn' />
               </ButtonGroup>
            </Row>
         </Form>
         {/* TODO rakenna linkin lisäys jo drinkin lisäykseen <AddLink onSaveLink={saveLink} /> */}
      </>
   )
}

export default AddDrink
