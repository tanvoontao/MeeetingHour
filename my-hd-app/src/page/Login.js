import React, { useState } from 'react';
import { Container, Form, Button, InputGroup, ButtonGroup, Row, Col, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import 'boxicons'
import axios from "axios"
import LoginImg from "../asset/login.svg";

const Login = () => {

    const [student, setStudent] = useState({
        email: '',
        password: '',
    })
    const { email, password } = student;

    const handleChange = e => {
        setStudent({ ...student, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const data = {
            email: email,
            password: password
        }

        axios({
            url: "https://localhost:7261/api/v1/student/login",
            method: "POST",
            data: data,
        })

            .then((res) => {
                const dt = res.data
                clear()
                localStorage.setItem("token", dt.Jwt)
                localStorage.setItem("id", dt.ID)
                localStorage.setItem("email", dt.Email)
                alert("Login Successfully")
                // navigate('/', { replace: true })
                window.location.href = "/"
            })

            .catch((error) => {
                console.log(error)
                alert(error.response.data);
                
            });
    }

    const clear = () => {
        setStudent({
            email: "",
            password: ""
        })
    }

    return (
        <Container className="my-3">
            <Row>
                <Col lg={7}>
                    <Form onSubmit={handleSubmit}>
                        <h1 className="mb-3">Student Login Form 🚪</h1>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Student Email Address</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><box-icon name='envelope' type='solid' color='grey' ></box-icon></InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    placeholder="xxxxxxxxx@students.swinburne.edu.my"
                                    name='email'
                                    value={email}
                                    onChange={handleChange} />
                            </InputGroup>

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><box-icon name='lock-alt' type='solid' color='grey' ></box-icon></InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    name='password'
                                    value={password}
                                    onChange={handleChange} />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="I have read and agree the Terms of Service and Privacy Policy. " />
                        </Form.Group>

                        <p>Don't have a student account? <u><strong> <a href="/register">Sign Up</a> </strong></u></p>

                        <ButtonGroup aria-label="Basic example">
                            <Button variant="secondary" onClick={clear}> Clear </Button>
                            <Button variant="primary" type="submit"> Login </Button>
                        </ButtonGroup>

                    </Form>
                </Col>
                <Col lg={5}>
                    <div className='d-flex justify-content-center flex-nowrap'>
                        <Image
                            rounded
                            src={LoginImg}
                            alt=""
                        ></Image>
                    </div>

                </Col>
            </Row>
        </Container>
    )
}

export default Login