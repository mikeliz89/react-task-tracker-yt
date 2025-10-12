import { Accordion, Table, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import PageTitle from './Site/PageTitle';
import { COLORS } from '../utils/Constants';

export default function AccordionElement({ title, array, iconName, forceOpen }) {
    return (
        <Row>
            <Col>
                <Accordion defaultActiveKey={forceOpen === true ? '0' : ''}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <PageTitle title={title} iconName={iconName} iconColor={COLORS.GRAY} />
                        </Accordion.Header>
                        <Accordion.Body>
                            <Table striped bordered hover>
                                <tbody>
                                    {array.map((element) => (
                                        <tr key={element.id}>
                                            <td>{element.name}</td>
                                            <td>{element.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </Row>
    )
}

AccordionElement.defaultProps = {
    title: '',
    iconName: '',
    forceOpen: false
}

AccordionElement.propTypes = {
    title: PropTypes.string,
    array: PropTypes.array,
    iconName: PropTypes.string,
    forceOpen: PropTypes.bool
}
