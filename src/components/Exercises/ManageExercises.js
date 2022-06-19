import GoBackButton from '../GoBackButton';
//react
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ManageExercises = () => {

  const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

  return (
    <div>
      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Link className="btn btn-primary" to={`/createexercise`}>{t('create_exercise')}</Link>
        </ButtonGroup>
      </Row>
      <h3 className="page-title">{t('manage_exercises_title')}</h3>
      <p className="text-center">{t('coming_soon')}</p>
    </div>
  )
}

export default ManageExercises