import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, ButtonGroup, Form, FormGroup, Table } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';

export default function TrackHoles({ holes }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

    return (
        <>
            <Row>
                <Col sm={1} xs={1}></Col>
                <Col sm={10} xs={10}>
                    <Table>
                        <tbody>
                            {
                                holes.map((hole, index) => (
                                    <tr key={hole.id}>
                                        <td>
                                            <span>{t('hole_number') + ': ' + hole.id}</span>
                                        </td>
                                        <td>
                                            <Button text="" iconName={Constants.ICON_MINUS} className='btn btn-inline' />
                                        </td>
                                        <td>
                                            <Form.Control type='text'
                                                autoComplete="off"
                                                placeholder={t('track_name')}
                                                value={hole.par}
                                                disabled={true}
                                                style={{ margin: '3px' }}
                                            />
                                        </td>
                                        <td>
                                            <Button text="" iconName={Constants.ICON_PLUS} />
                                        </td>

                                        <td>
                                            <Button iconName={Constants.ICON_DELETE} 
                                            style={{ backgroundColor: Constants.COLOR_ADDBUTTON_CLOSED }} />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
                <Col sm={1} xs={1}></Col>
            </Row>
        </>
    )
}