import { Link } from 'react-router-dom';
import Icon from '../Icon';
import PropTypes from 'prop-types';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';

export default function NavButton({ to, icon, iconColor = COLORS.WHITE, children, className = 'btn btn-primary', ...props }) {
  return (
    <Link to={to} className={className} {...props}>
      {icon && <Icon name={icon} color={iconColor} />}
      {children}
    </Link>
  );
}

NavButton.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};