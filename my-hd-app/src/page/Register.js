import React, { useState } from 'react';
import { Container, Form, Button, InputGroup, ButtonGroup, Row, Col, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import 'boxicons'
import axios from "axios"

import RegisterImg from "../asset/register.svg";

const Register = () => {

    const [student, setStudent] = useState({
        studentID: '',
        password: '',
    })
    const { studentID, password } = student;

    const navigate = useNavigate();
    const handleChange = e => {
        setStudent({ ...student, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const data = {
            StudentID: studentID,
            Email: studentID+"@students.swinburne.edu.my",
            Password: password
        }
        // ref: https://www.geeksforgeeks.org/axios-in-react-a-guide-for-beginners/

        axios({
            url: "https://localhost:7261/api/v1/student/",
            method: "POST",
            data: data,
        })
            .then((res) => {
                const dt = res.data
                if (dt == "ok") {
                    clear();
                    alert("Register Successfully. Please Login ");
                    navigate('/login', { replace: true })
                }
                else {
                    console.log(res);
                }
            })
            .catch((error) => {
                console.log(error)
                alert(error.response.data)
                clear()
            });
    }

    const clear = () => {
        setStudent({
            studentID: "",
            email: "",
            password: ""
        })
    }


    return (
        <Container className="my-3">
            <Row>
                <Col lg={7}>
                    <Form onSubmit={handleSubmit}>
                        <h1 className="mb-3">Student Registration Form ®️</h1>

                        <Form.Group as={Row} className="mb-3" controlId="studentID">
                            <Form.Label column sm={3}>
                                Student ID:
                            </Form.Label>
                            <Col sm={9}>
                                <InputGroup>
                                    <InputGroup.Text><box-icon name='id-card' type='solid' color='grey'></box-icon></InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="xxxxxxxxx"
                                        name='studentID'
                                        value={studentID}
                                        onChange={handleChange} />
                                </InputGroup>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="email">
                            <Form.Label column sm={3}>
                                Student Email:
                            </Form.Label>
                            <Col sm={9}>
                                <InputGroup>
                                    <InputGroup.Text><box-icon name='envelope' type='solid' color='grey' ></box-icon></InputGroup.Text>
                                    <Form.Control
                                        disabled
                                        type="email"
                                        placeholder="xxxxxxxxx@students.swinburne.edu.my"
                                        name='email'
                                        value={studentID ? (studentID+"@students.swinburne.edu.my") : ""}
                                        onChange={handleChange} />
                                </InputGroup>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="password">
                            <Form.Label column sm={3}>
                                Password:
                            </Form.Label>
                            <Col sm={9}>
                                <InputGroup>
                                    <InputGroup.Text><box-icon name='lock-alt' type='solid' color='grey' ></box-icon></InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        name='password'
                                        value={password}
                                        onChange={handleChange} />
                                </InputGroup>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formHorizontalCheck">
                            <Col sm={{ span: 9, offset: 3 }}>
                                <p>Already have a student account? <u><strong> <a href="/login">Log in</a> </strong></u></p>
                                <ButtonGroup aria-label="Basic example">
                                    <Button variant="secondary" onClick={clear}> Clear </Button>
                                    <Button variant="primary" type="submit"> Register </Button>
                                </ButtonGroup>
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>
                <Col lg={5}>
                    <div className='d-flex justify-content-center flex-nowrap'>
                        <Image
                            rounded
                            src={RegisterImg}
                            alt=""
                        ></Image>
                    </div>

                </Col>
            </Row>




        </Container>

    )
}

export default Register