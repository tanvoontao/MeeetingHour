import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Badge } from 'react-bootstrap'
import axios from "axios"
import { AuthContext } from "../../context/auth";
import StatusMsg from "../../component/StatusMsg"

const HistoryAppointments = () => {
    const { staff } = useContext(AuthContext);

    const [consultations, setConsultations] = useState([])

    useEffect(() => {
        axios({

            // Endpoint to send files
            url: "https://localhost:7261/Staff/History/" + staff.id,
            method: "GET",
            headers: {
                authorization: `Bearer ${staff.token}`
            },
        })

            // Handle the response from backend here
            .then((res) => {
                let consultations = []

                res.data.forEach(element => {
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

            // Catch errors if any
            .catch((error) => {
                // alert(error.response.data);
                console.log(error)
            });
    }, []);
    

    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>🔢 Ref Number</th>
                    <th>📅 Consultation Date</th>
                    <th>🕒 Time</th>
                    <th>👨‍🏫 Student</th>
                    <th>Status</th>
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
                        <td><StatusMsg status={consultation.status} /></td>
                        <td><Button href={"/staff/appointment/" + consultation.id} variant="outline-primary">View</Button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default HistoryAppointments