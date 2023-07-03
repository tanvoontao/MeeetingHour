import React, { useState, useEffect, useContext } from 'react';
import { Container, Breadcrumb, Table, Image, Button, ButtonGroup, Form } from 'react-bootstrap'
import 'boxicons'
import profileImg from "../../asset/register.svg"
import { AuthContext } from "../../context/auth";
import axios from "axios"
import AlertMessage from "../../component/Alert";

const Staffs = () => {
    const [staffs, setStaffs] = useState([])
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

    const updateStaffs = () => {
        axios({
            url: "https://localhost:7261/api/v1/Staff",
            method: "GET",
            headers: {
                authorization: `Bearer ${admin.token}`
            },
        })
            .then((res) => {
                let staffs = []
                let num = 0;

                res.data.forEach(element => {
                    staffs.push(
                        {
                            num: num += 1,
                            id: element.ID,
                            profileImg: element.ProfileImg,
                            name: `${element.LastName} ${element.FirstName}`,
                            email: element.Email,
                            gender: element.Gender,
                        }
                    )
                });
                setStaffs(staffs)
            })
            .catch((error) => {
                showAlertMsg(error)
                console.log(error)
            });
    }

    useEffect(() => {
        updateStaffs()
    }, []);

    const handleDelete = e => {

        let isConfirm = window.confirm("Do you really want to delete this staff? ")
        if (isConfirm) {
            axios({
                url: `https://localhost:7261/api/v1/Staff/${e.currentTarget.value}`,
                method: "DELETE",
                headers: {
                    authorization: `Bearer ${admin.token}`
                },
            })
                .then((res) => {
                    updateStaffs()
                    setAlertMsg({
                        msg: "You deleted a staff. ",
                        variant: "danger",
                        show: true
                    })

                })
                .catch((error) => {
                    showAlertMsg(error)
                });
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchWord != "") {
            axios({
                url: `https://localhost:7261/api/v1/Staff/ByName/${searchWord}`,
                method: "GET",
                headers: {
                    authorization: `Bearer ${admin.token}`
                },
            })
                .then((res) => {
                    let staffs = []
                    let num = 0;
    
                    res.data.forEach(element => {
                        staffs.push(
                            {
                                num: num += 1,
                                id: element.ID,
                                profileImg: element.ProfileImg,
                                name: `${element.LastName} ${element.FirstName}`,
                                email: element.Email,
                                gender: element.Gender,
                            }
                        )
                    });
                    setStaffs(staffs)
                })
                .catch((error) => {
                    console.log(error)
                    showAlertMsg(error)
                });
        } else {
            updateStaffs()
        }
        
    }
    const handleChange = (e) => {
        setSearchWord(e.target.value)
    }

    return (
        <Container className="my-5">
            <Breadcrumb>
                <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item href="/admin/staffs">
                    Staffs
                </Breadcrumb.Item>
            </Breadcrumb>

            <Button variant="success" className="my-3" href="/admin/staff/book" >Add New Staff</Button>
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
                        <th style={{ width: "10%" }}>Profile</th>
                        <th style={{ width: "25%" }}>Name</th>
                        <th style={{ width: "35%" }}>Staff Email</th>
                        <th style={{ width: "5%" }}>Gender</th>
                        <th style={{ width: "20%" }}></th>
                    </tr>
                </thead>
                <tbody>
                    {staffs.map((staff, i) => (
                        <tr key={i}>
                            <td>{staff.num}</td>
                            <td>
                                <Image src={staff.profileImg}
                                    rounded alt=""
                                    width="60"
                                    height="60"></Image>
                            </td>
                            <td>{staff.name}</td>
                            <td>{staff.email}</td>
                            <td>{staff.gender == "male" ? <box-icon name='male' color='white'></box-icon> : <box-icon name='female' color='white'></box-icon>}</td>
                            <td>
                                <ButtonGroup aria-label="Basic example">
                                    <Button variant="danger" value={staff.id} onClick={handleDelete} ><box-icon name='trash' type='solid' color='white' ></box-icon></Button>
                                    <Button variant="primary" href={`/admin/staff/${staff.id}`}><box-icon type='solid' name='edit-alt' color='white'></box-icon></Button>
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

export default Staffs