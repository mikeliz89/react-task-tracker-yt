import * as Constants from "../../utils/Constants";
import { useTranslation } from 'react-i18next';
import { Row, Col, Table } from "react-bootstrap";
import DeleteButton from '../Buttons/DeleteButton';
import { useState, useEffect } from "react";

export default function EventBands({ bands, onDelete }) {

  //translation
  const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_MUSIC });

  const [sortedBands, setSortedBands] = useState([]);

  useEffect(() => {
    setSortedBands(bands || []);
  }, [bands]);

  const sortByName = () => {
    const sorted = [...sortedBands].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setSortedBands(sorted);
  };

  const showBandName = (band) => {
    return band.name;
  }

  return (
    <>
      <p>{t('music_bands_title')}</p>
      <button onClick={sortByName}>{t('sort_by_name')}</button>
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
               {sortedBands != null && sortedBands.map((band) => (
                <tr key={band.id}>
                  <td>{showBandName(band)}</td>
                  <td>
                    <DeleteButton
                      onDelete={onDelete}
                      id={band}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  )
}