//react
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
//buttons
import GoBackButton from '../GoBackButton';
//icon
import Icon from '../Icon';
//page
import PageContentWrapper from '../PageContentWrapper';
//pagetitle
import PageTitle from '../PageTitle';

export default function Games() {

    const { t } = useTranslation('games', { keyPrefix: 'games' });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('games_title')} />
            <div>
                <Link to="/managegamelists" className='btn btn-primary'>
                    <Icon name='list-alt' color='white' />
                    {t('button_game_lists')}
                </Link>
            </div>
        </PageContentWrapper>
    )
}
