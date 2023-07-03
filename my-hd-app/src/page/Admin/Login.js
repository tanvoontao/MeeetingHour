import React, { useState } from 'react';
import { Container, Form, Button, InputGroup, ButtonGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import 'boxicons'
import axios from "axios"

const Login = () => {
    const [admin, setAdmin] = useState({
        email: '',
        password: '',
    })
    const { email, password } = admin;

    const handleChange = e => {
        setAdmin({ ...admin, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const data = {
            email: email,
            password: password
        }
        axios({
            url: "https://localhost:7261/api/v1/admin/login",
            method: "POST",
            data: data,
        })

            .then((res) => {
                const dt = res.data
                clear()
                localStorage.setItem("admin_token", dt.Jwt)
                localStorage.setItem("admin_id", dt.ID)
                localStorage.setItem("admin_email", dt.Email)
                alert("admin login successfully")
                window.location.href = "/admin/staffs/"
            })

            .catch((error) => {
                alert(error.response.data)
                console.log(error)
            });
    }

    const clear = () => {
        setAdmin({
            email: "",
            password: ""
        })
    }

    return (
        <Form className="m-5 p-5" onSubmit={handleSubmit}>
            <h1 className="mb-3">Admin Login Form 🚪</h1>
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
            
            <ButtonGroup aria-label="Basic example">
                <Button variant="secondary" onClick={clear}> Clear </Button>
                <Button variant="primary"  type="submit"> Login </Button>
            </ButtonGroup>

        </Form>
    )
}

export default Login