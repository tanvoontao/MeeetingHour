import React, { useState } from 'react';
import { Container, Form, Button, InputGroup, ButtonGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import 'boxicons'
import axios from "axios"

const Login = () => {
    const [staff, setStaff] = useState({
        email: '',
        password: '',
    })
    const { email, password } = staff;
    const navigate = useNavigate();

    const handleChange = e => {
        // target their name attribute and its value
        setStaff({ ...staff, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const data = {
            email: email,
            password: password
        }




        axios({

            // Endpoint to send files
            url: "https://localhost:7261/api/v1/staff/login",
            method: "POST",
            // headers: {

            //     // Add any auth token here
            //     authorization: "your token comes here",
            // },

            // Attaching the form data
            data: data,
        })

            // Handle the response from backend here
            .then((res) => {
                const dt = res.data
                clear()
                localStorage.setItem("staff_token", dt.Jwt)
                localStorage.setItem("staff_id", dt.ID)
                localStorage.setItem("staff_email", dt.Email)
                alert("staff login successfully")
                // navigate('/', { replace: true })
                window.location.href = "/staff/dashboard"
            })

            // Catch errors if any
            .catch((error) => {
                // console.log(error)
                alert(error.response.data)
                console.log(error.response.data)
            });
    }

    const clear = () => {
        setStaff({
            email: "",
            password: ""
        })
    }

    return (
        <Form className="m-5 p-5" onSubmit={handleSubmit}>
            <h1 className="mb-3">Staff Login Form 🚪</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <InputGroup>
                    <InputGroup.Text><box-icon name='envelope' type='solid' color='grey' ></box-icon></InputGroup.Text>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
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
            
            <ButtonGroup aria-label="Basic example">
                <Button variant="secondary" onClick={clear}> Clear </Button>
                <Button variant="primary"  type="submit"> Login </Button>
            </ButtonGroup>

        </Form>
    )
}

export default Login