import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';

export default function TrackHole({ hole, decreasePar, increasePar, deleteHole }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DISC_GOLF });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    return (
        <>
            <td>
                <span>{t('hole_number') + ': ' + (hole.id + 1)}</span>
            </td>
            <td>
                <span> Par:</span>&nbsp;&nbsp;&nbsp;

                <Button type='button'
                    onClick={() => decreasePar(hole.id)}
                    iconName={ICONS.MINUS} className='btn btn-inline'
                />

                <span className={hole.par < 3 || hole.par > 3 ? 'btn bolded' : 'btn'}>
                    {hole.par}
                </span>

                <Button type='button'
                    onClick={() => increasePar(hole.id)}
                    iconName={ICONS.PLUS}
                />
            </td >

            <td>
                <Button
                    color={COLORS.DELETEBUTTON}
                    type='button'
                    text={tCommon('buttons.button_delete')}
                    onClick={() => deleteHole(hole.id)}
                    iconName={ICONS.DELETE}
                    style={{ backgroundColor: COLORS.ADDBUTTON_CLOSED }}
                />
            </td>
        </>
    )
}