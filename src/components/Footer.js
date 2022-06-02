import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {

    const { t } = useTranslation('footer', { keyPrefix: 'footer' })

    return (
        <footer>
            <p>{t('copyright')} &copy; 2022</p>
            <Link to="/about">{t('about')}</Link>
        </footer>
    )
}

export default Footer
