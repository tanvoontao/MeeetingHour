import React, { useState } from 'react';
import { Container, Tab, Tabs, Breadcrumb } from 'react-bootstrap'
import UpComingConsultation from '../component/UpComingConsultation';
import PendingConsultation from '../component/PendingConsultation';
import HistoryConsultation from '../component/HistoryConsultation';


const Consultation = () => {
    const [key, setKey] = useState('Up Coming Consultation');

    return (
        <Container className="my-5">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="">
                    Consultations
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{key}</Breadcrumb.Item>
            </Breadcrumb>

            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className='mb-3'
            >
                <Tab eventKey="Up Coming Consultation" title="⏳ Up Coming Consultation">
                    {key=="Up Coming Consultation" ? <UpComingConsultation />: <></>}
                </Tab>
                <Tab eventKey="Pending Consultation" title="✋ Pending Consultation">
                    {key=="Pending Consultation" ? <PendingConsultation /> : <></>}
                </Tab>
                <Tab eventKey="History Consultation" title="📜 History Consultation">
                    {key=="History Consultation" ? <HistoryConsultation /> : <></>}
                </Tab>
            </Tabs>
        </Container>

    )
}

export default Consultation