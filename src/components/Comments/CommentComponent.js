import { useState } from "react";
import AddComment from "./AddComment";
import Comments from "./Comments";
import PageTitle from '../Site/PageTitle';
import { useTranslation } from "react-i18next";
import * as Constants from '../../utils/Constants';

export default function CommentComponent({ objID, url, onSave }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_COMMENTS, { keyPrefix: Constants.TRANSLATION_COMMENTS });

    //states
    const [counter, setCounter] = useState(0);

    return (
        <>
            <PageTitle title={t('header') + (counter > 0 ? ' (' + counter + ')' : '')}
                iconName={Constants.ICON_COMMENTS} iconColor='gray' isSubTitle={true} />
            <AddComment onSave={onSave} />
            <Comments objID={objID} url={url} onCounterChange={setCounter} />
        </>
    )
}