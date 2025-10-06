import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button';
import * as Constants from '../../utils/Constants';

export default function TrackHole({ hole, decreasePar, increasePar, deleteHole }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });

    return (
        <>
            <td>
                <span>{t('hole_number') + ': ' + (hole.id + 1)}</span>
            </td>
            <td>
                <span> Par:</span>&nbsp;&nbsp;&nbsp;

                <Button type='button'
                    onClick={() => decreasePar(hole.id)}
                    iconName={Constants.ICON_MINUS} className='btn btn-inline'
                />

                <span className={hole.par < 3 || hole.par > 3 ? 'btn bolded' : 'btn'}>
                    {hole.par}
                </span>

                <Button type='button'
                    onClick={() => increasePar(hole.id)}
                    iconName={Constants.ICON_PLUS}
                />
            </td >

            <td>
                <Button
                    color={Constants.COLOR_DELETEBUTTON}
                    type='button'
                    text={tCommon('buttons.button_delete')}
                    onClick={() => deleteHole(hole.id)}
                    iconName={Constants.ICON_DELETE}
                    style={{ backgroundColor: Constants.COLOR_ADDBUTTON_CLOSED }}
                />
            </td>
        </>
    )
}