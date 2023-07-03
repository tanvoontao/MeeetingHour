import React, { useState, useEffect, useContext } from 'react';
import { Container, Breadcrumb, Table, Image, Button, ButtonGroup, Form } from 'react-bootstrap'
import 'boxicons'
import { AuthContext } from "../../context/auth";
import axios from "axios"
import AlertMessage from "../../component/Alert";

const Students = () => {
    const [students, setStudents] = useState([])
    const { admin } = useContext(AuthContext);
    const [alertMsg, setAlertMsg] = useState({
        msg: "all good",
        variant: "primary",
        show: false
    })
    const [searchWord, setSearchWord] = useState("")

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

    const updateStudents = () => {
        axios({
            url: "https://localhost:7261/api/v1/Student",
            method: "GET",
            headers: {
                authorization: `Bearer ${admin.token}`
            },
        })
            .then((res) => {
                let students = []
                let num = 0;

                console.log(res.data)

                res.data.forEach(element => {
                    students.push(
                        {
                            num: num += 1,
                            id: element.ID,
                            studentId: element.StudentID,
                            profileImg: element.ProfileImg,
                            name: `${element.LastName} ${element.FirstName}`,
                            email: element.Email,
                            gender: element.Gender,
                        }
                    )
                });
                setStudents(students)
            })
            .catch((error) => {
                showAlertMsg(error)
                console.log(error)
            });
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchWord != "") {
            axios({
                url: `https://localhost:7261/api/v1/Student/ByName/${searchWord}`,
                method: "GET",
                headers: {
                    authorization: `Bearer ${admin.token}`
                },
            })
                .then((res) => {
                    let students = []
                    let num = 0;

                    console.log(res.data)

                    res.data.forEach(element => {
                        students.push(
                            {
                                num: num += 1,
                                id: element.ID,
                                studentId: element.StudentID,
                                profileImg: element.ProfileImg,
                                name: `${element.LastName} ${element.FirstName}`,
                                email: element.Email,
                                gender: element.Gender,
                            }
                        )
                    });
                    setStudents(students)
                })
                .catch((error) => {
                    console.log(error)
                    showAlertMsg(error)
                });
        } else {
            updateStudents()
        }

    }
    const handleChange = (e) => {
        setSearchWord(e.target.value)
    }

    useEffect(() => {
        updateStudents()
    }, []);

    const handleDelete = e => {

        let isConfirm = window.confirm("Do you really want to delete this student? ")
        if (isConfirm) {
            axios({
                url: `https://localhost:7261/api/v1/Student/${e.currentTarget.value}`,
                method: "DELETE",
                headers: {
                    authorization: `Bearer ${admin.token}`
                },
            })
                .then((res) => {
                    updateStudents()
                    setAlertMsg({
                        msg: "You deleted a student. ",
                        variant: "danger",
                        show: true
                    })

                })
                .catch((error) => {
                    showAlertMsg(error)
                });
        }
    }

    return (
        <Container className="my-5">
            <Breadcrumb>
                <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item href="/admin/students">
                    Students
                </Breadcrumb.Item>
            </Breadcrumb>

            <Button variant="success" className="my-3" href="/admin/student/book" >Add New Students</Button>
            <Form className="d-flex my-3" onSubmit={handleSearch}>
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    name="searchWord"
                    value={searchWord}
                    onChange={handleChange}
                />
                <Button variant="outline-success" type="submit">Search</Button>
            </Form>

            <Table striped bordered hover responsive variant="dark" >
                <thead>
                    <tr>
                        <th style={{ width: "5%" }}>#</th>
                        <th style={{ width: "10%" }}>Student ID</th>
                        <th style={{ width: "25%" }}>Name</th>
                        <th style={{ width: "35%" }}>Student Email</th>
                        <th style={{ width: "5%" }}>Gender</th>
                        <th style={{ width: "20%" }}></th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, i) => (
                        <tr key={i}>
                            <td>{student.num}</td>
                            <td>{student.studentId}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.gender == "male" ? <box-icon name='male' color='white'></box-icon> : <box-icon name='female' color='white'></box-icon>}</td>
                            <td>
                                <ButtonGroup aria-label="Basic example">
                                    <Button variant="danger" value={student.id} onClick={handleDelete} ><box-icon name='trash' type='solid' color='white' ></box-icon></Button>
                                    <Button variant="primary" href={`/admin/student/${student.id}`}><box-icon type='solid' name='edit-alt' color='white'></box-icon></Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <AlertMessage msg={alertMsg.msg} variant={alertMsg.variant} prompt={alertMsg.show} />
        </Container>
    )
}

export default Students