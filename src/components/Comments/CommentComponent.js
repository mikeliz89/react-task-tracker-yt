

//states

import { useState } from "react";
import { useTranslation } from "react-i18next";


import { TRANSLATION, COLORS, ICONS } from '../../utils/Constants';
import PageTitle from '../Site/PageTitle';

import Comments from "./Comments";

export default function CommentComponent({ objID, url, onSave }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.COMMENTS });
const [counter, setCounter] = useState(0);

    return (
        <div className="content-panel">
            <div className="content-panel-header">
                <PageTitle
                    iconName={ICONS.COMMENTS}
                    iconColor={COLORS.GRAY}
                    title={counter > 0 ? `${t('header')} (${counter})` : t('header')}
                    isSubTitle={true}
                />
            </div>
            <Comments objID={objID} url={url} onCounterChange={setCounter} onSave={onSave} />
        </div>
    )
}



