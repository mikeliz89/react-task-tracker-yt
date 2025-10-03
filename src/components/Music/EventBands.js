import Button from "../Buttons/Button";
import * as Constants from "../../utils/Constants";
import { useTranslation } from 'react-i18next';
import { Row, Col, Table } from "react-bootstrap";

export default function EventBands({ bands, onDelete }) {

  //translation
  const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_MUSIC });

  const showBandName = (band) => {
    return band.name;
  }

  const deleteBand = (band) => {
    const obj = { name: band.name, id: band.id };
    onDelete(obj);
  }

  return (
    <>
      <p>{t('music_bands_title')}</p>
      <Row>
        <Col>
          <Table bordered>
            <thead>
              <tr>
                <th>{t('band_name')}</th>
                <th>{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {bands != null && bands.map((band) => (
                <tr key={band.id}>
                  <td>{showBandName(band)}</td>
                  <td> <Button onClick={() => deleteBand(band)} text={t('button_delete')} color={Constants.COLOR_DELETEBUTTON} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  )
}