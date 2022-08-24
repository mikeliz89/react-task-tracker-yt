//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../Button';
//drink
import { DrinkCategories } from './Categories';
//link component
// import AddLink from '../Links/AddLink';

const AddDrink = ({ drinkID, onAddDrink, onClose }) => {

   const DB_DRINKS = "/drinks";

   //translation
   const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

   //states
   const [category, setCategory] = useState('');
   const [categories, setCategories] = useState(DrinkCategories);
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [glass, setGlass] = useState('');
   const [created, setCreated] = useState('');
   const [createdBy, setCreatedBy] = useState('');
   const [stars, setStars] = useState(0);

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

      const dbref = ref(db, `${DB_DRINKS}/${drinkID}`);
      get(dbref).then((snapshot) => {
         if (snapshot.exists()) {
            var val = snapshot.val();
            setCategory(val["category"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setDescription(val["description"]);
            setGlass(val["glass"]);
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

      onAddDrink({ created, createdBy, title, description, category, glass, stars });

      if (drinkID == null) {
         clearForm();
      }
   }

   const clearForm = () => {
      setTitle('');
      setDescription('');
      setGlass('');
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
