import { useState } from 'react';
import { ButtonGroup, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Button from '../Buttons/Button';
import CenterWrapper from '../Site/CenterWrapper';
import GoBackButton from '../Buttons/GoBackButton';
import NavButton from '../Buttons/NavButton';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import useFetch from '../Hooks/useFetch';
import AddCar from './AddCar';

export default function ManageCars() {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
    const { currentUser } = useAuth();
    const { data: carLists, loading } = useFetch(DB.CARS);
    const [showAddCar, setShowAddCar] = useState(false);

    const getCarLabel = (car) => {
        const brand = car?.brand || '';
        const model = car?.modelName || '';
        return `${brand} ${model}`.trim();
    };

    const cars = Array.isArray(carLists)
        ? [...carLists].sort((a, b) => getCarLabel(a).localeCompare(getCarLabel(b)))
        : [];

    const addCar = (car) => {
        const brand = car.brand || '';
        const modelLabel = car.modelName || '';
        const payload = {
            brand,
            modelName: modelLabel,
            created: getCurrentDateAsJson(),
            createdBy: currentUser?.email || ''
        };

        pushToFirebase(DB.CARS, payload);
        setShowAddCar(false);
    };

    return loading ? (
        <h3>{tCommon('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <PageTitle title={t('choose_vehicle_title')} iconName={ICONS.CAR} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        onClick={() => setShowAddCar(true)}
                        iconName={ICONS.PLUS}
                        secondIconName={ICONS.CAR}
                        text={t('add_car')}
                    />
                    <NavButton to={NAVIGATION.MANAGE_CARLISTS} icon={ICONS.LIST_ALT}>
                        {tCommon('buttons.button_lists')}
                    </NavButton>
                </ButtonGroup>
            </Row>

            <Modal show={showAddCar} onHide={() => setShowAddCar(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('add_car')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddCar
                        onSave={addCar}
                        onClose={() => setShowAddCar(false)}
                    />
                </Modal.Body>
            </Modal>

            {cars.length === 0 ? (
                <CenterWrapper>
                    {t('no_vehicles_to_choose')}
                </CenterWrapper>
            ) : (
                <div className="d-grid gap-2 mt-3">
                    {cars.map((car) => (
                        <NavButton
                            key={car.id}
                            to={`${NAVIGATION.CAR}/${encodeURIComponent(car.id)}`}
                            icon={ICONS.CAR}
                            className="btn btn-primary"
                        >
                            {getCarLabel(car) || t('car_title')}
                        </NavButton>
                    ))}
                </div>
            )}
        </PageContentWrapper>
    );
}
