import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, ButtonGroup } from 'react-bootstrap'
import axios from "axios"
import { AuthContext } from "../../context/auth";
import AlertMessage from "../../component/Alert";

const UpComingAppointments = () => {
    const { staff } = useContext(AuthContext);

    const [consultations, setConsultations] = useState([])
    const [alertMsg, setAlertMsg] = useState({
        msg: "all good",
        variant: "primary",
        show: false
    })

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

    const updateAppointments = () => {
        axios({
            url: "https://localhost:7261/Staff/UpComing/" + staff.id,
            method: "GET",
            headers: {
                authorization: `Bearer ${staff.token}`
            },
        })
            .then((res) => {
                let consultations = []
                const dt = res.data
                dt.forEach(element => {
                    let status = "pass";
                    if (element.Approve & element.Complete) {
                        status = "complete";
                    }
                    else if (element.Approve & !(element.Complete)) {
                        status = "approve";
                    }
                    else if (!(element.Approve) & element.Cancel) {
                        status = "cancel";
                    }

                    consultations.push(
                        {
                            id: element.ID,
                            datetime: element.DateTime,
                            student_email: element.Student_email,
                            status: status
                        }
                    )
                });

                setConsultations(consultations)
            })
            .catch((error) => {
                console.log(error)
                showAlertMsg(error)
            });
    }

    useEffect(() => {
        updateAppointments()
    }, []);

    const handleCancel = (e) => {
        let isConfirm = window.confirm("Do you really want to cancel this appointment? ")
        if (isConfirm) { 
            axios({
                url: "https://localhost:7261/api/v1/Appointment/Cancel/" + e.target.value,
                method: "GET",
                headers: {
                    authorization: `Bearer ${staff.token}`
                },
            })
                .then((res) => {
                    console.log(res);
                    setAlertMsg({
                        msg: "cancel successfully",
                        variant: "success",
                        show: true
                    })
                    updateAppointments()
                })
                .catch((error) => { showAlertMsg(error) });
        }
    }

    const handleApprove = (e) => {
        axios({
            url: "https://localhost:7261/api/v1/Appointment/Approve/" + e.target.value,
            method: "GET",
            headers: {
                authorization: `Bearer ${staff.token}`
            },
        })
            .then((res) => {
                setAlertMsg({
                    msg: "You have approved an appointment",
                    variant: "success",
                    show: true
                })
                updateAppointments()
            })
            .catch((error) => { showAlertMsg(error) });
    }
    const handleComplete = (e) => {
        axios({
            url: "https://localhost:7261/api/v1/Appointment/Complete/" + e.target.value,
            method: "GET",
            headers: {
                authorization: `Bearer ${staff.token}`
            },
        })
            .then((res) => {
                console.log(res);
                setAlertMsg({
                    msg: "You have completed an appointment",
                    variant: "success",
                    show: true
                })
                updateAppointments()
            })
            .catch((error) => { showAlertMsg(error) });
    }

    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>🔢 Ref Number</th>
                    <th>📅 Consultation Date</th>
                    <th>🕒 Time</th>
                    <th>👨‍🏫 Student</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {consultations.map((consultation) => (
                    <tr>
                        <td>{consultation.id}</td>
                        <td>{consultation.datetime.slice(0, consultation.datetime.indexOf(" "))}</td>
                        <td>{consultation.datetime.slice(consultation.datetime.indexOf(' ') + 1)}</td>
                        <td>{consultation.student_email}</td>
                        <td>
                            <ButtonGroup aria-label="Basic example">
                                {
                                    consultation.status == "approve" ?
                                        <Button variant="outline-success" value={consultation.id} onClick={handleComplete}> Complete </Button>
                                        :
                                        <Button variant="outline-success" value={consultation.id} onClick={handleApprove}> Approve </Button>
                                }
                                <Button variant="outline-danger" value={consultation.id} onClick={handleCancel}>  {consultation.status == "approve" ? "Cancel" : "Reject"} </Button>
                                <Button href={"/staff/appointment/" + consultation.id} variant="outline-primary">View</Button>
                            </ButtonGroup>

                        </td>
                    </tr>
                ))}
            </tbody>
            <AlertMessage msg={alertMsg.msg} variant={alertMsg.variant} prompt={alertMsg.show} />
        </Table>
    )
}

export default UpComingAppointments