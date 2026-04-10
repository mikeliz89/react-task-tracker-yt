import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TRANSLATION } from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';

const versionInfoList = [
    {
        version: '2.2.2',
        upgradedDate: '4.4.2026',
        author: 'Miika Kontio',
        description: 'About-sivun versiohistoria muutettu datalistaksi, visuaalinen erottelu parannettu ja listaus lajiteltu uusimmasta vanhimpaan.'
    },
    {
        version: '2.2.1',
        upgradedDate: '6.10.2025',
        author: 'Miika Kontio',
        description: 'DetailsPage-uudistus, mobiilityylien tiivistys ja useita i18n-parannuksia.'
    },
    {
        version: '2.2.0',
        upgradedDate: '22.9.2025',
        author: 'Miika Kontio',
        description: 'BoardGame-laajennus, listatyyppien erottelu ja dashboard-integraatio.'
    }
];

export default function About() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.ABOUT });

    const sortedVersionInfoList = useMemo(() => {
        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split('.').map(Number);
            return new Date(year, month - 1, day);
        };

        return [...versionInfoList].sort((a, b) => parseDate(b.upgradedDate) - parseDate(a.upgradedDate));
    }, []);

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('title')} />

            <div className='about-version-list'>
                {sortedVersionInfoList.map((info) => (
                    <div key={info.version} className='content-card about-version-card'>
                        <h4 className='page-title page-title-subtitle'>{t('about_version')} {info.version}</h4>
                        <p><strong>{t('version_upgraded')}:</strong> {info.upgradedDate}</p>
                        <p><strong>{t('about_author')}:</strong> {info.author}</p>
                        <p className='about-version-description'><strong>{t('description')}:</strong> {info.description}</p>
                    </div>
                ))}
            </div>
        </PageContentWrapper>
    )
}



