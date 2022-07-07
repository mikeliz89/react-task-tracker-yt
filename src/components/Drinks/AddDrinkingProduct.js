//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../Button';
//drink
import { DrinkingProductCategories } from './Categories';

const AddDrinkingProduct = ({ drinkingProductID, onAddDrinkingProduct, onClose }) => {

   const DB_DRINKINGPRODUCTS = '/drinkingproducts';

   //translation
   const { t, ready } = useTranslation('drinks', { keyPrefix: 'drinks' });

   //states
   const [category, setCategory] = useState('');
   const [categories, setCategories] = useState(DrinkingProductCategories);
   const [name, setName] = useState('');
   const [manufacturer, setManufacturer] = useState('');
   const [description, setDescription] = useState('');
   const [created, setCreated] = useState('');
   const [createdBy, setCreatedBy] = useState('');
   const [haveAtHome, setHaveAtHome] = useState('');
   const [abv, setAbv] = useState(0);
   const [amount, setAmount] = useState(0);

   //load data
   useEffect(() => {
      if (drinkingProductID != null) {
         const getDrinkingProduct = async () => {
            await fetchDrinkingProductFromFirebase(drinkingProductID)
         }
         getDrinkingProduct()
      }
   }, [drinkingProductID]);

   useEffect(() => {
      sortCategoriesByName();
   }, [ready]);

   const sortCategoriesByName = () => {
      const sortedCategories = [...categories].sort((a, b) => {
         const aName = t(`drinkingproduct_category_${a.name}`);
         const bName = t(`drinkingproduct_category_${b.name}`);
         return aName > bName ? 1 : -1;
      });
      setCategories(sortedCategories);
   }

   /** get drink incredient from firebase by id (in EDIT drink incredient) */
   const fetchDrinkingProductFromFirebase = async (id) => {
      const dbref = ref(db, `${DB_DRINKINGPRODUCTS}/${id}`);
      get(dbref).then((snapshot) => {
         if (snapshot.exists()) {
            var val = snapshot.val();
            setName(val["name"]);
            setDescription(val["description"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setCategory(val["category"]);
            setManufacturer(val["manufacturer"]);
            setHaveAtHome(val["haveAtHome"]);
            setAbv(val["abv"]);
            setAmount(val["amount"]);
         }
      });
   }

   /** Drink Form Submit */
   const onSubmit = (e) => {
      e.preventDefault()

      //validation
      if (!name) {
         alert(t('please_add_drink_incredient'))
         return
      }

      onAddDrinkingProduct({
         created, createdBy, name,
         description, category, manufacturer,
         haveAtHome, abv, amount
      });

      if (drinkingProductID == null) {
         //clear the form
         setName('');
         setManufacturer('');
         setDescription('');
         setCategory('');
         setAbv(0);
         setHaveAtHome(false);
         setAmount(0);
      }
   }

   return (
      <>
         <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Name">
               <Form.Label>{t('drinkingproduct_name')}</Form.Label>
               <Form.Control type='text'
                  placeholder={t('drinkingproduct_name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Description">
               <Form.Label>{t('drinkingproduct_description')}</Form.Label>
               <Form.Control type='text'
                  placeholder={t('drinkingproduct_description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Manufacturer">
               <Form.Label>{t('drinkingproduct_manufacturer')}</Form.Label>
               <Form.Control type='text'
                  placeholder={t('drinkingproduct_manufacturer')}
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Category">
               <Form.Label>{t('drinkingproduct_category')}</Form.Label>
               <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(({ id, name }) => (
                     <option value={id}
                        key={id}>{t(`drinkingproduct_category_${name}`)}</option>
                  ))}
               </Form.Select>
            </Form.Group>
            <Form.Group>
               <Form.Label>{t('drinkingproduct_abv')}</Form.Label>
               <Form.Control type='text'
                  value={abv}
                  onChange={(e) => setAbv(e.target.value)}
               />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Amount">
               <Form.Label>{t('drinkingproduct_amount')}</Form.Label>
               <Form.Control type='text'
                  placeholder={t('drinkingproduct_amount')}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-HaveAtHome">
               <Form.Check
                  type='checkbox'
                  label={t('drinkingproduct_have_at_home')}
                  checked={haveAtHome}
                  value={haveAtHome}
                  onChange={(e) => setHaveAtHome(e.currentTarget.checked)} />
            </Form.Group>
            <Row>
               <ButtonGroup>
                  <Button type="button" text={t('button_close')} className='btn btn-block' onClick={() => onClose()} />
                  <Button type='submit' text={t('button_save_drink')} className='btn btn-block saveBtn' />
               </ButtonGroup>
            </Row>
         </Form>
      </>
   )
}

export default AddDrinkingProduct
