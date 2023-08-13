import { useTranslation } from 'react-i18next';
import { FaCheckSquare } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import { getMovieFormatNameByID } from '../../utils/ListUtils';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import AddMovie from './AddMovie';

export default function Movie({ movie, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MOVIES, { keyPrefix: Constants.TRANSLATION_MOVIES });

    //states
    const [editable, setEditable] = useState(false);

    const updateMovie = (updateMovieID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_MOVIES, updateMovieID, object);
        setEditable(false);
    }

    const markHaveAtHome = () => {
        movie["haveAtHome"] = true;
        onEdit(movie);
    }

    const markNotHaveAtHome = () => {
        movie["haveAtHome"] = false;
        onEdit(movie);
    }

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    {movie.name} {movie.publishYear > 0 ? '(' + movie.publishYear + ')' : ''}
                </span>
                <RightWrapper>
                    <Icon name={Constants.ICON_EDIT} className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <Icon className='deleteBtn'
                        name={Constants.ICON_DELETE}
                        color={Constants.COLOR_DELETEBUTTON} fontSize='1.2em' cursor='pointer'
                        onClick={() => {
                            if (window.confirm(t('delete_movie_confirm_message'))) {
                                onDelete(movie.id);
                            }
                        }} />
                </RightWrapper>
            </h5>
            {!editable &&
                <p>
                    {movie.nameFi != "" ? movie.nameFi : ''}
                </p>
            }
            {!editable &&
                <p>
                    {movie.format > 0 ?
                        (<span> {
                            t('movie_format_' + getMovieFormatNameByID(movie.format))
                        }</span>) : ('')}
                </p>
            }
            {!editable &&
                <p>
                    {movie.description}
                </p>
            }
            {!editable &&
                <p>
                    <Link className='btn btn-primary' to={`${Constants.NAVIGATION_MOVIE}/${movie.id}`}>{t('view_details')}</Link>
                </p>
            }
            <StarRating starCount={movie.stars} />

            {
                editable && <AddMovie
                    movieID={movie.id}
                    onClose={() => setEditable(false)}
                    onSave={updateMovie}
                    showLabels={false} />
            }

            <p>
                {
                    movie.haveAtHome &&
                    <span
                        onClick={() => { markNotHaveAtHome() }}
                        className='btn btn-success' style={{ margin: '5px' }}>
                        {t('have')}&nbsp;
                        <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                    </span>
                }
                {
                    !movie.haveAtHome &&
                    <span
                        onClick={() => { markHaveAtHome() }}
                        className='btn btn-danger' style={{ margin: '5px' }}>
                        {t('have_not')}&nbsp;
                        <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                    </span>
                }
            </p>
        </div>
    )
}