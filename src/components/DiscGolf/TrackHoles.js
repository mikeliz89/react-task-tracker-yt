import { Row, Col, Table } from 'react-bootstrap';
import TrackHole from './TrackHole';

export default function TrackHoles({ holes, increasePar, decreasePar, deleteHole }) {

    return (
        <>
            <Row>
                <Col sm={1}></Col>
                <Col sm={10} xs={12}>
                    <Table>
                        <tbody>
                            {
                                holes.map((hole, index) => (
                                    <tr key={hole.id}>
                                        <TrackHole hole={hole}
                                            increasePar={increasePar}
                                            decreasePar={decreasePar}
                                            deleteHole={deleteHole} />
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
                <Col sm={1}></Col>
            </Row>
        </>
    )
}