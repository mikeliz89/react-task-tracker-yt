import { Form } from 'react-bootstrap';

import { ICONS } from '../../utils/Constants';
import Icon from '../Icon';

export default function SearchTextInput({ value, onChange, placeholder }) {
    return (
        <div className="dashboard-search-input">
            <Icon name={ICONS.SEARCH} color="#8f9bb3" fontSize="1rem" className="dashboard-search-icon" />
            <Form.Control
                className="dashboard-search-control"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
