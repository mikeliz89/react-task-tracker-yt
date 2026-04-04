import Links from './Links';
import { useState } from 'react';
import PageTitle from '../Site/PageTitle';
import { useTranslation } from 'react-i18next';
import { TRANSLATION, COLORS, ICONS } from '../../utils/Constants';

export default function LinkComponent({ objID, url, onSaveLink }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.LINKS });

    //states
    const [counter, setCounter] = useState(0);

    return (
        <div className="content-panel">
            <div className="content-panel-header">
                <PageTitle
                    iconName={ICONS.EXTERNAL_LINK_ALT}
                    iconColor={COLORS.GRAY}
                    title={counter > 0 ? `${t('header')} (${counter})` : t('header')}
                    isSubTitle={true}
                />
            </div>
            <Links objID={objID} url={url} onCounterChange={setCounter} onSaveLink={onSaveLink} />
        </div>
    )
}
