import React, { useState, useContext, useEffect } from 'react';
import { Container, Breadcrumb, Image, Form, Button, Row, Col, InputGroup, ButtonGroup } from 'react-bootstrap'
import { AuthContext } from "../../context/auth";
import axios from "axios"
import AlertMessage from "../../component/Alert";

const Profile = () => {
    const { staff } = useContext(AuthContext);

    const [data, setData] = useState({
        id: staff.id,
        firstName: "",
        lastName: "",
        gender: "",
        biography: "",
        profileImg: "",
        email: "",
        password: ""
    });
    const [file, setFile] = useState("")
    const [fileName, setFileName] = useState("")
    const [alertMsg, setAlertMsg] = useState({
        msg: "all good",
        variant: "primary",
        show: false
    })

    const { id, firstName, lastName, gender, biography, profileImg, email, password } = data;

    const handleUploadImg = (e) => {
        let file = e.target.files[0]

        let extension = file.name.split('.').pop()
        let ms = Date.now();
        let newFileName = ms + "." + extension;


        let myNewFile = new File([file], newFileName, { type: file.type });

        // console.log(myNewFile)
        // console.log(myNewFile.name)
        setFile(myNewFile)
        setFileName(myNewFile.name)
    }

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dt = {
            Id: data.id,
            FirstName: data.firstName,
            LastName: data.lastName,
            Gender: data.gender,
            Biography: data.biography,
            ProfileImg: fileName,
            Email: data.email,
            Password: data.password,
        }

        const formdata = new FormData();
        formdata.append("FormFile", file)
        formdata.append("FileName", fileName)

        console.log(data)

        if (fileName !== "") {
            axios.post(
                "https://localhost:7261/api/v1/Staff/UploadProfileImage",
                formdata,
                { headers: { "authorization": `Bearer ${staff.token}` } })
                .then((res) => {
                    console.log(res)
                    clear()
                    setAlertMsg({
                        msg: "New Profile Uploaded",
                        variant: "success",
                        show: true
                    })
                    loadStaffData()

                })
                .catch((error) => {
                    console.log(error)
                    showAlertMsg(error)
                })
        }

        axios.put(
            `https://localhost:7261/api/v1/Staff/${dt.Id}`, dt,
            { headers: { "authorization": `Bearer ${staff.token}` } })
            .then((res) => {
                clear()
                setAlertMsg({
                    msg: "Edit Saved",
                    variant: "success",
                    show: true
                })
                loadStaffData()
                
            })
            .catch((error) => {
                showAlertMsg(error)
            })

        // try {
        //     if (fileName !== "") {
        //         const res = axios.post("https://localhost:7261/api/v1/Staff/UploadProfileImage", formdata, { headers: { "authorization": `Bearer ${staff.token}` } })
        //         console.log(res)
        //     }
        //     const res = axios.put(`https://localhost:7261/api/v1/Staff/${dt.Id}`, dt, { headers: { "authorization": `Bearer ${staff.token}` } })
        //     console.log(res)
        //     alert("edit saved")
        //     window.location.reload()
        // } catch (error) {
        //     console.log(error)
        // }
    }

    const loadStaffData = () => {
        axios({
            url: `https://localhost:7261/api/v1/Staff/${staff.id}`,
            method: "GET",
            headers: {
                authorization: `Bearer ${staff.token}`
            },
        })

            .then((res) => {
                const dt = res.data
                setData({
                    id: dt.ID,
                    firstName: dt.FirstName,
                    lastName: dt.LastName,
                    gender: dt.Gender,
                    biography: dt.Biography,
                    profileImg: dt.ProfileImg,
                    email: dt.Email,
                    password: ""
                });

            })
            .catch((error) => {
                // alert(error.response.data);
                console.log(error)
                showAlertMsg(error)
            });
    }

    useEffect(() => {
        loadStaffData()
    }, []);

    const clear = () => {
        setData({
            id: "",
            firstName: "",
            lastName: "",
            gender: "",
            biography: "",
            profileImg: "",
            email: "",
            password: ""
        })
        setFile("")
        setFileName("")
        setAlertMsg({
            msg: "",
            variant: "",
            show: false
        })
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
        <Container className="my-5">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="/profile">
                    Profile
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{staff.email}</Breadcrumb.Item>
            </Breadcrumb>

            <Form onSubmit={handleSubmit}>

                <h2>Staff Personal Information</h2>
                <Row className="mb-3">
                    <Col>
                        <Image src={profileImg}
                            rounded alt=""
                            width="100"
                            height="100"></Image>
                    </Col>
                    <Form.Group as={Col} controlId="formFile" className="mb-3">
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control type="file" accept="image/png, image/gif, image/jpeg, image/jpg" onChange={handleUploadImg} />
                        <Form.Text id="passwordHelpBlock" muted>
                            Leave it blank if you do not want to change the profile
                        </Form.Text>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="firstname">
                        <Form.Label>First Name</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><box-icon name='rename' color='grey' ></box-icon></InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                name='firstName'
                                value={firstName}
                                onChange={handleChange} />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} controlId="lastname">
                        <Form.Label>Last Name</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><box-icon name='rename' color='grey' ></box-icon></InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                name='lastName'
                                value={lastName}
                                onChange={handleChange} />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} controlId="gender" onChange={handleChange}>
                        <Form.Label>Gender</Form.Label>
                        <InputGroup>
                            <Form.Check
                                inline
                                checked={gender === "male" ? true : false}
                                type="radio"
                                id="male"
                                value="male"
                                label="👨 male"
                                name="gender"

                            />
                            <Form.Check
                                inline
                                checked={gender === "female" ? true : false}
                                type="radio"
                                id="female"
                                value="female"
                                label="👧 female"
                                name="gender"

                            />
                        </InputGroup>

                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="biography">
                        <Form.Label>Biography</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><box-icon type='solid' color='grey' name='info-circle'></box-icon></InputGroup.Text>
                            <Form.Control
                                as="textarea"
                                aria-label="With textarea"
                                placeholder="Enter biography"
                                value={biography}
                                name="biography"
                                rows="6" cols="500"
                                onChange={handleChange}
                            />
                        </InputGroup>
                    </Form.Group>
                </Row>


                <h2>Security</h2>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email address</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><box-icon name='envelope' type='solid' color='grey' ></box-icon></InputGroup.Text>
                            <Form.Control
                                disabled
                                type="email"
                                placeholder="Enter email"
                                name='email'
                                value={email}
                                onChange={handleChange} />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
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
                        <Form.Text id="passwordHelpBlock" muted>
                            Leave it blank if you do not want to change the password
                        </Form.Text>
                    </Form.Group>
                </Row>


                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>

            <AlertMessage msg={alertMsg.msg} variant={alertMsg.variant} prompt={alertMsg.show} />
        </Container>
    )
}

export default Profile