import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';

const ManageTaskListsArchive = () => {

  const { t } = useTranslation();

  return (
    <div>
      <h3 className="page-title">{t('manage_tasklists_archive_title')}</h3>
       <GoBackButton  />
    </div>
  )
}

export default ManageTaskListsArchive