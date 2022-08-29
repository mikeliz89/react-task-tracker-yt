//react
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
//buttons
import GoBackButton from '../GoBackButton';
//pagetitle
import PageTitle from '../PageTitle';
//icons
import Icon from '../Icon';

export default function ManageBackPacking() {

    //translation
    const { t } = useTranslation('backpacking', { keyPrefix: 'backpacking' });

    return (
        <div>
            <GoBackButton />
            <PageTitle title={t('manage_backpacking_title')} />

            <div className="page-content">
                <Link to="/managegear" className='btn btn-primary'>{t('button_manage_gear')}</Link>
                &nbsp;
                <Link to="/backpackinglists" className='btn btn-primary'>
                    <Icon name='list-alt' color='white' />
                    {t('button_manage_backpacking_lists')}
                </Link>
            </div>
        </div>
    )
}
