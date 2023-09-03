import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from '../../utils/Constants';
import PageContentWrapper from '../Site/PageContentWrapper';
import GoBackButton from '../Buttons/GoBackButton';

export default function StartNewRound() {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

   useEffect(() => {
      //sortCategoriesByName();
   }, []);

   const sortCategoriesByName = () => {

   }

   return (
      <PageContentWrapper>

         <Row>
            <ButtonGroup>
               <GoBackButton />
            </ButtonGroup>
         </Row>

      </PageContentWrapper>
   )
}
