import React, {useState, useEffect, useContext } from 'react';
import { Container, Table, Button } from 'react-bootstrap'
import axios from "axios"
import { AuthContext } from "../context/auth";

const PendingConsultation = () => {
    const { user } = useContext(AuthContext);

    const [consultations, setConsultations] = useState([])

    useEffect(() => {
        axios({
            url: "https://localhost:7261/Student/Pending/" + user.id,
            method: "GET",
            headers: {
                authorization: `Bearer ${user.token}`
            },
        })
            .then((res) => {
                let consultations = []

                res.data.forEach(element => {

                    consultations.push(
                        {
                            id: element.ID,
                            datetime: element.DateTime,
                            staff_email: element.Staff_email
                        }
                    )
                });

                setConsultations(consultations)
            })
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
                        <td><Button href={"consultation/"+consultation.id} variant="outline-primary">View</Button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default PendingConsultation