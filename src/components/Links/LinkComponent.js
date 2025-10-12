import AddLink from './AddLink';
import Links from './Links';
import { useState } from 'react';
import PageTitle from '../Site/PageTitle';
import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';

export default function LinkComponent({ objID, url, onSaveLink }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.LINKS });

    //states
    const [counter, setCounter] = useState(0);

    return (
        <>
            <PageTitle iconName={'external-link-alt'} iconColor={COLORS.GRAY}
                title={t('header') + (counter > 0 ? ' (' + counter + ')' : '')}
                isSubTitle={true} />
            <AddLink onSaveLink={onSaveLink} />
            <Links objID={objID} url={url} onCounterChange={setCounter} />
        </>
    )
}
