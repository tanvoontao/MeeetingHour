import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, ListGroup, Button, ButtonGroup } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import axios from "axios"
import { AuthContext } from "../context/auth";
import StatusMsg from "../component/StatusMsg"
import AlertMessage from "../component/Alert";

const Consultation = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [disabled, setDisabled] = useState(false)
    const [consultation, setConsultation] = useState(
        {
            ref_num: '',
            staff: '',
            status: '',
            note: '',
            cancel_reason: '',
            datetime: ''
        }
    )
    const [alertMsg, setAlertMsg] = useState({
        msg: "all good",
        variant: "primary",
        show: false
    })

    const updateConsultation = () => {
        axios({

            // Endpoint to send files
            url: "https://localhost:7261/api/v1/Appointment/" + id,
            method: "GET",
            headers: {
                authorization: `Bearer ${user.token}`
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

                if (status == "cancel" || status == "complete") {
                    setDisabled(true)
                }


                setConsultation(
                    {
                        ref_num: res.data.ID,
                        staff: res.data.Staff_email,
                        status: status,
                        note: res.data.Note,
                        cancel_reason: res.data.Cancel_reason,
                        datetime: res.data.DateTime
                    }
                )
            })

            // Catch errors if any
            .catch((error) => {
                // alert(error.response.data);
                console.log(error)
            });
    }
    useEffect(() => {
        updateConsultation()
    }, []);


    const handleCancel = () => {
        let isConfirm = window.confirm("Do you really want to cancel this consultation? ")
        if (isConfirm) { 
            axios({

                // Endpoint to send files
                url: "https://localhost:7261/api/v1/Appointment/Cancel/" + id,
                method: "GET",
                headers: {
                    authorization: `Bearer ${user.token}`
                },
            })
                .then((res) => {
                    console.log(res);
                    setAlertMsg({
                        msg: "cancel successfully",
                        variant: "success",
                        show: true
                    })
                    updateConsultation()
                })
                .catch((error) => { showAlertMsg(error) });
        }
        
    }

    const showAlertMsg = (error) => {
        if (error.response.status == "401") {
            setAlertMsg({
                msg: "Session expired. Please Login Again",
                variant: "warning",
                show: true
            })
        }
        else {
            setAlertMsg({
                msg: error.response.data,
                variant: "warning",
                show: true
            })
        }
    }

    return (
        <Card className="m-5" bg="dark" key="dark" text="white">
            <Card.Header>Ref Num: {consultation.ref_num}</Card.Header>
            <ListGroup variant="flush">
                <ListGroup.Item><strong>Consultation Date and Time:</strong> {consultation.datetime}</ListGroup.Item>
                <ListGroup.Item><strong>Staff:</strong> {consultation.staff}</ListGroup.Item>
                <ListGroup.Item><strong>Status:</strong> <StatusMsg status={consultation.status} /></ListGroup.Item>
                {consultation.status == "complete" ?? <ListGroup.Item><strong>Note:</strong> {consultation.note}</ListGroup.Item>}
                {consultation.status == "cancel" ?? <ListGroup.Item><strong>Cancel reason:</strong> {consultation.cancel_reason}</ListGroup.Item>}
            </ListGroup>
            <Card.Footer>
                <ButtonGroup aria-label="Basic example">
                    <Button variant="primary" href="/consultations">🔙 Back</Button>
                    <Button variant="danger" type="submit" onClick={handleCancel} disabled={disabled}>✖️ Cancel</Button>
                </ButtonGroup>
            </Card.Footer>
            <AlertMessage msg={alertMsg.msg} variant={alertMsg.variant} prompt={alertMsg.show} />
        </Card>
    )
}

export default Consultation