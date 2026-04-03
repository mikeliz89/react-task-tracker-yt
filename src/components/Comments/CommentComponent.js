import { useState } from "react";
import Comments from "./Comments";
import PageTitle from '../Site/PageTitle';
import { useTranslation } from "react-i18next";
import { TRANSLATION, ICONS, COLORS } from '../../utils/Constants';

export default function CommentComponent({ objID, url, onSave }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.COMMENTS });

    //states
    const [counter, setCounter] = useState(0);

    return (
        <div className="content-panel">
            <div className="content-panel-header">
                <PageTitle title={counter > 0 ? `${t('header')} (${counter})` : t('header')}
                    iconName={ICONS.COMMENTS} iconColor={COLORS.GRAY} isSubTitle={true} />
            </div>
            <Comments objID={objID} url={url} onCounterChange={setCounter} onSave={onSave} />
        </div>
    )
}
