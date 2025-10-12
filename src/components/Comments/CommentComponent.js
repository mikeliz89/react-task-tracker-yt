import { useState } from "react";
import AddComment from "./AddComment";
import Comments from "./Comments";
import PageTitle from '../Site/PageTitle';
import { useTranslation } from "react-i18next";
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';

export default function CommentComponent({ objID, url, onSave }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.COMMENTS });

    //states
    const [counter, setCounter] = useState(0);

    return (
        <>
            <PageTitle title={t('header') + (counter > 0 ? ' (' + counter + ')' : '')}
                iconName={ICONS.COMMENTS} iconColor={COLORS.GRAY} isSubTitle={true} />
            <AddComment onSave={onSave} />
            <Comments objID={objID} url={url} onCounterChange={setCounter} />
        </>
    )
}