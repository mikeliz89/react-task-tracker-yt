import Round from "./Round";
import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';

export default function Rounds({ rounds, onDelete }) {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

   return (
      <>
         {
            rounds.map((round) => (
               <Round key={round.id} round={round} onDelete={onDelete} />
            ))
         }
      </>
   )
}