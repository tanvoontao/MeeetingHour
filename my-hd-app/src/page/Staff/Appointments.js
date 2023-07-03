import React, { useState } from 'react';
import { Container, Tab, Tabs, Breadcrumb } from 'react-bootstrap'
import UpComingAppointments from '../../component/Staff/UpComingAppointments';
import HistoryAppointments from '../../component/Staff/HistoryAppointments';


const Appointments = () => {
    const [key, setKey] = useState('Up Coming Appointments');

    return (
        <Container className="my-5">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item href="/staff/appointments">
                    Appointments
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{key}</Breadcrumb.Item>
            </Breadcrumb>

            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className='mb-3'
            >
                <Tab eventKey="Up Coming Appointments" title="⏳ Up Coming Appointments">
                    {key=="Up Coming Appointments" ? <UpComingAppointments />: <></>}
                </Tab>
                
                <Tab eventKey="History Appointments" title="📜 History Appointments">
                    {key=="History Appointments" ? <HistoryAppointments /> : <></>}
                </Tab>
            </Tabs>
        </Container>
    )
}

export default Appointments