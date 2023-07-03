import React, {useState, useEffect, useContext } from 'react';
import { Container, Table, Button } from 'react-bootstrap'
import axios from "axios"
import { AuthContext } from "../context/auth";
import StatusMsg from "../component/StatusMsg"

const HistoryConsultation = () => {
    const { user } = useContext(AuthContext);

    const [consultations, setConsultations] = useState([])

    useEffect(() => {
        axios({

            // Endpoint to send files
            url: "https://localhost:7261/Student/History/" + user.id,
            method: "GET",
            headers: {
                authorization: `Bearer ${user.token}`
            },
        })

            // Handle the response from backend here
            .then((res) => {
                let consultations = []

                res.data.forEach(element => {
                    let status = "pass";
                    if (element.Complete == true)
                    {
                        status = "complete"
                    }
                    else if (element.Cancel == true)
                    {
                        status = "cancel"
                    }

                    consultations.push(
                        {
                            id: element.ID,
                            datetime: element.DateTime,
                            staff_email: element.Staff_email,
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
                    <th>👨‍🏫 Staff</th>
                    <th>🟢🔴 Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {consultations.map((consultation) => (
                        <tr>
                        <td>{consultation.id}</td>
                        <td>{consultation.datetime.slice(0, consultation.datetime.indexOf(" "))}</td>
                        <td>{consultation.datetime.slice(consultation.datetime.indexOf(' ') + 1)}</td>
                        <td>{consultation.staff_email}</td>
                        <td><StatusMsg status={consultation.status} /></td>
                        <td><Button href={"consultation/"+consultation.id} variant="outline-primary">View</Button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default HistoryConsultation