import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, ButtonGroup, Form, FormGroup, Table } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';

export default function TrackHole({ hole, decreasePar, increasePar, deleteHole }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

    return (
        <>
            <td>
                <span>{t('hole_number') + ': ' + (hole.id + 1)}</span>
            </td>
            <td>
                Par: <span>{hole.par}</span>
            </td>
            <td>
                <Button
                    onClick={() => decreasePar(hole.id)}
                    iconName={Constants.ICON_MINUS} className='btn btn-inline' />
                <Button onClick={() => increasePar(hole.id)}
                    iconName={Constants.ICON_PLUS} />
            </td>

            <td>
                <Button
                    onClick={() => deleteHole(hole.id)}
                    iconName={Constants.ICON_DELETE}
                    style={{ backgroundColor: Constants.COLOR_ADDBUTTON_CLOSED }} />
            </td>
        </>
    )
}