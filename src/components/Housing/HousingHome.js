import { useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { subscribeToFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { DB, TRANSLATION } from '../../utils/Constants';
import Alert from '../Alert';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import { useAlert } from '../Hooks/useAlert';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';

const housingTypeOptions = [
    'apartment_block',
    'row_house',
    'detached_house',
    'semi_detached_house',
    'loft_house',
    'small_house',
    'separate_house',
    'vacation_home',
    'farm_house',
    'other'
];

export default function HousingHome() {
    const { t, i18n } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.HOUSING });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
    const { currentUser } = useAuth();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [housingType, setHousingType] = useState('');
    const [constructionYear, setConstructionYear] = useState('');

    const sortedHousingTypeOptions = useMemo(() => (
        [...housingTypeOptions].sort((a, b) =>
            t(`housing_type_${a}`).localeCompare(t(`housing_type_${b}`), i18n.language, { sensitivity: 'base' })
        )
    ), [t, i18n.language]);

    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    useEffect(() => {
        if (!currentUser?.uid) {
            return;
        }

        const unsubscribe = subscribeToFirebaseById(DB.HOUSING, currentUser.uid, (snapshot) => {
            const data = snapshot.val();

            if (!data) {
                setName('');
                setAddress('');
                setArea('');
                setHousingType('');
                setConstructionYear('');
                return;
            }

            setName(data.name || '');
            setAddress(data.address || '');
            setArea(data.area ? String(data.area) : '');
            setHousingType(data.housingType || '');
            setConstructionYear(data.constructionYear ? String(data.constructionYear) : '');
        });

        return () => unsubscribe();
    }, [currentUser?.uid]);

    const onSubmit = async (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedAddress = address.trim();
        const currentYear = new Date().getFullYear();
        const areaNumber = Number(area);
        const yearNumber = Number(constructionYear);

        if (!trimmedName || !trimmedAddress || !area || !housingType || !constructionYear) {
            showFailure(t('required_fields'));
            return;
        }

        if (!Number.isFinite(areaNumber) || areaNumber <= 0) {
            showFailure(t('invalid_area'));
            return;
        }

        if (!Number.isInteger(yearNumber) || yearNumber < 1000 || yearNumber > currentYear + 1) {
            showFailure(t('invalid_construction_year'));
            return;
        }

        try {
            await updateToFirebaseById(DB.HOUSING, currentUser.uid, {
                name: trimmedName,
                address: trimmedAddress,
                area: areaNumber,
                housingType,
                constructionYear: yearNumber
            });
            showSuccess(tCommon('save_success'));
        } catch {
            showFailure(tCommon('save_exception'));
        }
    };

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('title')} />

            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                onClose={clearMessages}
            />

            <Form onSubmit={onSubmit} className='myprofile-page'>
                <div className='content-card myprofile-main-card'>
                    <Form.Group className='mb-3' controlId='housingName'>
                        <Form.Label>{t('name')}</Form.Label>
                        <Form.Control
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='housingAddress'>
                        <Form.Label>{t('address')}</Form.Label>
                        <Form.Control
                            type='text'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='housingArea'>
                        <Form.Label>{t('area_m2')}</Form.Label>
                        <Form.Control
                            type='number'
                            min='1'
                            step='0.5'
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='housingType'>
                        <Form.Label>{t('housing_type')}</Form.Label>
                        <Form.Select
                            value={housingType}
                            onChange={(e) => setHousingType(e.target.value)}
                            required
                        >
                            <option value=''>{t('housing_type_none')}</option>
                            {sortedHousingTypeOptions.map((type) => (
                                <option key={type} value={type}>
                                    {t(`housing_type_${type}`)}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='housingConstructionYear'>
                        <Form.Label>{t('construction_year')}</Form.Label>
                        <Form.Control
                            type='number'
                            min='1000'
                            max={new Date().getFullYear() + 1}
                            value={constructionYear}
                            onChange={(e) => setConstructionYear(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button
                        type='submit'
                        text={tCommon('buttons.button_save')}
                        className='btn btn-block saveBtn myprofile-save-btn'
                    />
                </div>
            </Form>
        </PageContentWrapper>
    );
}
