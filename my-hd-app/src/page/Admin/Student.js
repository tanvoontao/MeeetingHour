import React, { useState, useEffect, useContext } from 'react';
import { Container, Button, ButtonGroup, Form, Row, Col, Image, InputGroup, Breadcrumb } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import axios from "axios"
import { AuthContext } from "../../context/auth";
import profileImg from "../../asset/register.svg"
import AlertMessage from "../../component/Alert";

const Student = () => {
    const { id } = useParams();
    const [preview, setPreview] = useState(false);
    const { admin } = useContext(AuthContext);

    const [data, setData] = useState({
        id: "",
        studentID: "",
        firstName: "",
        lastName: "",
        gender: "",
        address: "",
        profileImg: "",
        email: "",
        password: ""
    });
    const [file, setFile] = useState("")
    const [fileObj, setFileObj] = useState("")
    const [fileName, setFileName] = useState("")
    const [alertMsg, setAlertMsg] = useState({
        msg: "all good",
        variant: "primary",
        show: false
    })

    const { student_id, studentID, firstName, lastName, gender, address, profileImg, email, password } = data;


    useEffect(() => {
        if (id != "book") {
            loadStudentData()
        }
    }, []);

    const loadStudentData = () => {
        axios({
            url: `https://localhost:7261/api/v1/Student/${id}`,
            method: "GET",
            headers: {
                authorization: `Bearer ${admin.token}`
            },
        })

            .then((res) => {
                const dt = res.data
                setData({
                    id: dt.ID,
                    studentID: dt.StudentID,
                    firstName: dt.FirstName,
                    lastName: dt.LastName,
                    gender: dt.Gender,
                    address: dt.Address,
                    profileImg: dt.ProfileImg,
                    email: dt.Email,
                    password: ""
                });
                setFile(dt.ProfileImg)
                setPreview(true)

            })
            .catch((error) => {
                // alert(error.response.data);
                console.log(error)
                showAlertMsg(error)
            });
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

    const addNewStudent = () => {
        const dt = {
            StudentID: data.studentID,
            FirstName: data.firstName,
            LastName: data.lastName,
            Gender: data.gender,
            Address: data.address,
            ProfileImg: fileName,
            Email: data.studentID + "@students.swinburne.edu.my",
            Password: data.password,
        }

        const formdata = new FormData();
        formdata.append("FormFile", fileObj)
        formdata.append("FileName", fileName)

        if (fileName !== "") {
            axios.post("https://localhost:7261/api/v1/Student/UploadProfileImage", formdata, { headers: { "authorization": `Bearer ${admin.token}` } })
                .then((res) => {
                    setAlertMsg({
                        msg: "Profile uploaded",
                        variant: "success",
                        show: true
                    })
                })
                .catch((error) => {
                    showAlertMsg(error)
                })
        }
        axios.post(`https://localhost:7261/api/v1/Student`, dt, { headers: { "authorization": `Bearer ${admin.token}` } })
            .then((res) => {
                clear()
                setAlertMsg({
                    msg: "Added successfully",
                    variant: "success",
                    show: true
                })
            })
            .catch((error) => {
                showAlertMsg(error)
            })
    }

    const updateStudent = () => {
        const dt = {
            Id: data.id,
            StudentID: data.studentID,
            FirstName: data.firstName,
            LastName: data.lastName,
            Gender: data.gender,
            Address: data.address,
            ProfileImg: fileName,
            Email: `${data.studentID}@students.swinburne.edu.my`,
            Password: data.password,
        }

        const formdata = new FormData();
        formdata.append("FormFile", fileObj)
        formdata.append("FileName", fileName)


        if (fileName !== "") {
            axios.post(
                "https://localhost:7261/api/v1/Student/UploadProfileImage",
                formdata,
                { headers: { "authorization": `Bearer ${admin.token}` } })
                .then((res) => {
                    console.log(res)
                    clear()
                    setAlertMsg({
                        msg: "New Profile Uploaded",
                        variant: "success",
                        show: true
                    })
                    loadStudentData()

                })
                .catch((error) => {
                    showAlertMsg(error)
                })
        }

        axios.put(
            `https://localhost:7261/api/v1/Student/${dt.Id}`, dt,
            { headers: { "authorization": `Bearer ${admin.token}` } })
            .then((res) => {
                clear()
                setAlertMsg({
                    msg: "Edit Saved",
                    variant: "success",
                    show: true
                })
                loadStudentData()

            })
            .catch((error) => {
                showAlertMsg(error)
            })


    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (id == "book") {
            addNewStudent()
        } else {
            updateStudent()
        }
    }

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleProfileClick = async (e) => {
        let img_input = e.target.querySelector('input')
        img_input.click()
        setPreview(true)
    }

    const handleUploadImg = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
        let file = e.target.files[0]

        let extension = file.name.split('.').pop()
        let ms = Date.now();
        let newFileName = ms + "." + extension;
        let myNewFile = new File([file], newFileName, { type: file.type });

        setFileObj(myNewFile)
        setFileName(myNewFile.name)
    }

    const clear = () => {
        setData({
            id: "",
            studentID: "",
            firstName: "",
            lastName: "",
            gender: "",
            address: "",
            profileImg: "",
            email: "",
            password: ""
        })
        setFile("")
        setFileObj("")
        setFileName("")
        setPreview(false)
        setAlertMsg({
            msg: "",
            variant: "",
            show: false
        })
    }

    return (
        <Container className="my-5">
            <Breadcrumb>
                <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item href="/admin/students">
                    students
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{id}</Breadcrumb.Item>
            </Breadcrumb>


            <Form onSubmit={handleSubmit}>
                <h2>Personal Information</h2>
                <Row>

                    <Form.Group lg={4} as={Col} controlId="prof_img" className="mb-3">
                        <Form.Label>Profile Picture</Form.Label>

                        <div className="upload_profile_area p-3" onClick={handleProfileClick} >
                            <Form.Control hidden type="file" accept="image/png, image/gif, image/jpeg, image/jpg" onChange={handleUploadImg} />
                            <Image src={file}
                                rounded
                                hidden={preview ? false : true}
                                className='img_thumbnail'
                            ></Image>
                            <div style={preview ? { display: 'none' } : {}}>
                                <box-icon name='upload' ></box-icon>
                                <p>Click to upload staff profile</p>
                            </div>

                        </div>
                        <Form.Text id="profilehelp" muted>
                            Leave it blank if you do not want to change the profile
                        </Form.Text>
                    </Form.Group>

                    <Col lg={8}>
                        <Row>
                            <Form.Group lg={6} as={Col} controlId="formFile" className="mb-3">
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
                            <Form.Group lg={6} as={Col} controlId="lastname">
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
                        </Row>

                        <Row>
                            <Form.Group lg={7} as={Col} controlId="studentID">
                                <Form.Label>Student ID</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><box-icon name='id-card' type='solid' color='grey'></box-icon></InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="xxxxxxxxx"
                                        name='studentID'
                                        value={studentID}
                                        onChange={handleChange} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group lg={5} as={Col} controlId="gender" onChange={handleChange}>
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
                                        readOnly
                                    />
                                    <Form.Check
                                        inline
                                        checked={gender === "female" ? true : false}
                                        type="radio"
                                        id="female"
                                        value="female"
                                        label="👧 female"
                                        name="gender"
                                        readOnly
                                    />
                                </InputGroup>

                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="address">
                                <Form.Label>Address</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><box-icon type='solid' color='grey' name='info-circle'></box-icon></InputGroup.Text>
                                    <Form.Control
                                        as="textarea"
                                        aria-label="With textarea"
                                        placeholder="Enter address"
                                        value={address}
                                        name="address"
                                        rows="6" cols="500"
                                        onChange={handleChange}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Row>
                    </Col>



                </Row>

                <h2>Security</h2>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <InputGroup>
                            <InputGroup.Text><box-icon name='envelope' type='solid' color='grey' ></box-icon></InputGroup.Text>
                            <Form.Control
                                disabled
                                type="email"
                                placeholder="Enter email"
                                name='email'
                                value={studentID ? (studentID + "@students.swinburne.edu.my") : ""}
                                onChange={handleChange} />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
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

                    <Col>
                        <ButtonGroup aria-label="Basic example">
                            <Button variant="secondary" onClick={clear} > Clear </Button>
                            <Button variant="primary" type="submit"> Save </Button>
                        </ButtonGroup>
                    </Col>
                </Row>


            </Form>

            <AlertMessage msg={alertMsg.msg} variant={alertMsg.variant} prompt={alertMsg.show} />
        </Container>
    )
}

export default Student