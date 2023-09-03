import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from '../../utils/Constants';

export default function StartGame() {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });
   
   useEffect(() => {
      //sortCategoriesByName();
   }, []);

   const sortCategoriesByName = () => {
     
   }

   return (
      <>
         <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="startGameForm-TrackName">
               {showLabels && <Form.Label>{t('track')}</Form.Label>}
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={t('track')}
                  value={title}
                  onChange={(e) => setTrack(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkForm-Description">
               {showLabels && <Form.Label>{t('description')}</Form.Label>}
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={drinkID == null ? t('description') : t('description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkForm-Glass">
               {showLabels && <Form.Label>{t('glass')}</Form.Label>}
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={drinkID == null ? t('glass') : t('glass')}
                  value={glass}
                  onChange={(e) => setGlass(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkForm-Category">
               {showLabels && <Form.Label>{t('category')}</Form.Label>}
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
      </>
   )
}
