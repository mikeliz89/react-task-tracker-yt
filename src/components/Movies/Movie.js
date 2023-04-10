import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import { getMovieFormatNameByID } from '../../utils/ListUtils';

const Movie = ({ movie, onDelete }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MOVIES, { keyPrefix: Constants.TRANSLATION_MOVIES });

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    {movie.name} {movie.publishYear > 0 ? '(' + movie.publishYear + ')' : ''}
                </span>
                <Icon className='deleteBtn' name={Constants.ICON_DELETE} color='red' fontSize='1.2em' cursor='pointer'
                    onClick={() => { if (window.confirm(t('delete_movie_confirm_message'))) { onDelete(movie.id); } }} />
            </h5>
            <p>
                {movie.nameFi != "" ? movie.nameFi : ''}
            </p>
            <p>
                {movie.format > 0 ?
                    (<span> {
                        t('movie_format_' + getMovieFormatNameByID(movie.format))
                    }</span>) : ('')}
            </p>
            <p>
                {movie.description}
            </p>
            <p>
                <Link className='btn btn-primary' to={`${Constants.NAVIGATION_MOVIE}/${movie.id}`}>{t('view_details')}</Link>
            </p>
            <StarRating starCount={movie.stars} />
        </div>
    )
}

export default Movie