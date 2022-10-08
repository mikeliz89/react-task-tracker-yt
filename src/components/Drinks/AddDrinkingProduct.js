import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import Button from '../Button';
import { DrinkingProductCategories } from './Categories';
import * as Constants from '../../utils/Constants';
import { getFromFirebaseById } from '../../datatier/datatier';

const AddDrinkingProduct = ({ drinkingProductID, onAddDrinkingProduct, onClose }) => {

   //translation
   const { t, ready } = useTranslation(Constants.TRANSLATION_DRINKS, { keyPrefix: Constants.TRANSLATION_DRINKS });

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
   const [stars, setStars] = useState(0);
   const [amount, setAmount] = useState(0);

   //load data
   useEffect(() => {
      if (drinkingProductID != null) {
         const getDrinkingProduct = async () => {
            await fetchDrinkingProductFromFirebase(drinkingProductID);
         }
         getDrinkingProduct();
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

   const fetchDrinkingProductFromFirebase = async (id) => {
      getFromFirebaseById(Constants.DB_DRINKINGPRODUCTS, id).then((val) => {
         setAbv(val["abv"]);
         setAmount(val["amount"]);
         setCategory(val["category"]);
         setCreated(val["created"]);
         setCreatedBy(val["createdBy"]);
         setDescription(val["description"]);
         setHaveAtHome(val["haveAtHome"]);
         setManufacturer(val["manufacturer"]);
         setName(val["name"]);
         setStars(val["stars"]);
      });
   }

   const onSubmit = (e) => {
      e.preventDefault()

      //validation
      if (!name) {
         alert(t('please_add_drink_product'));
         return
      }

      onAddDrinkingProduct({
         abv, amount, category,
         created, createdBy, description,
         haveAtHome, manufacturer, name,
         stars
      });

      if (drinkingProductID == null) {
         clearForm();
      }
   }

   const clearForm = () => {
      setName('');
      setManufacturer('');
      setDescription('');
      setCategory('');
      setAbv(0);
      setHaveAtHome(false);
      setAmount(0);
   }

   return (
      <>
         <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Name">
               <Form.Label>{t('drinkingproduct_name')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={t('drinkingproduct_name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Description">
               <Form.Label>{t('drinkingproduct_description')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={t('drinkingproduct_description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Manufacturer">
               <Form.Label>{t('drinkingproduct_manufacturer')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
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
                  autoComplete="off"
                  value={abv}
                  onChange={(e) => setAbv(e.target.value)}
               />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Amount">
               <Form.Label>{t('drinkingproduct_amount')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
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
