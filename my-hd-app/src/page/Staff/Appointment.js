import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, ListGroup, Breadcrumb, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import axios from "axios"
import { AuthContext } from "../../context/auth";
import StatusMsg from "../../component/StatusMsg"

const Appointment = () => {
    const { staff } = useContext(AuthContext);
    const { id } = useParams();
    const [consultation, setConsultation] = useState(
        {
            ref_num: '',
            student: '',
            status: '',
            note: '',
            cancel_reason: '',
            datetime: ''
        }
    )

    useEffect(() => {
        axios({

            // Endpoint to send files
            url: "https://localhost:7261/api/v1/Appointment/" + id,
            method: "GET",
            headers: {
                authorization: `Bearer ${staff.token}`
            },
        })

            // Handle the response from backend here
            .then((res) => {
                console.log(res.data);
                let status = "nan";

                if (res.data.Approve && res.data.Complete) {
                    status = "complete";
                }
                else if (res.data.Approve && !(res.data.Complete)) {
                    status = "approve";
                }
                else if (!(res.data.Approve) && !(res.data.Complete) && (res.data.Cancel)) {
                    status = "cancel";
                }
                else if (!(res.data.Approve) && res.data.Pending && !(res.data.Complete)) {
                    status = "pending";
                }
                setConsultation(
                    {
                        ref_num: res.data.ID,
                        student: res.data.Student_email,
                        status: status,
                        note: res.data.Note,
                        cancel_reason: res.data.Cancel_reason,
                        datetime: res.data.DateTime
                    }
                )
            })

            .catch((error) => {
                // alert(error.response.data);
                console.log(error)
            });
    }, []);


    return (
        <Container className="my-5">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item href="/staff/appointments">
                    Appointments
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{id}</Breadcrumb.Item>
            </Breadcrumb>
            
            <Button className="my-3" variant="primary" href="/staff/appointments" >Back</Button>

            <Card bg="dark" key="dark" text="white">
                <Card.Header>Ref Num: {consultation.ref_num}</Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item><strong>Consultation Date and Time:</strong> {consultation.datetime}</ListGroup.Item>
                    <ListGroup.Item><strong>Student:</strong> {consultation.student}</ListGroup.Item>
                    <ListGroup.Item><strong>Status:</strong> <StatusMsg status={consultation.status} /></ListGroup.Item>
                    {consultation.status == "complete" ?? <ListGroup.Item><strong>Note:</strong> {consultation.note}</ListGroup.Item>}
                    {consultation.status == "cancel" ?? <ListGroup.Item><strong>Cancel reason:</strong> {consultation.cancel_reason}</ListGroup.Item>}
                </ListGroup>
            </Card>
        </Container>
    )
}

export default Appointment