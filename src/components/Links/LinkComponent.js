import AddLink from './AddLink';
import Links from './Links';
import { useState } from 'react';
import PageTitle from '../Site/PageTitle';
import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';

export default function LinkComponent({ objID, url, onSaveLink }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_LINKS, { keyPrefix: Constants.TRANSLATION_LINKS });

    //states
    const [counter, setCounter] = useState(0);

    return (
        <>
            <PageTitle iconName={'external-link-alt'} iconColor='gray'
                title={t('header') + (counter > 0 ? ' (' + counter + ')' : '')}
                isSubTitle={true} />
            <AddLink onSaveLink={onSaveLink} />
            <Links objID={objID} url={url} onCounterChange={setCounter} />
        </>
    )
}
