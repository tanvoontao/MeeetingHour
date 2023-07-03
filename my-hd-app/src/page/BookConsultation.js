import React, { useState, useContext } from 'react';
import { Container, Form, Button, InputGroup, ButtonGroup, Row, Col, Breadcrumb } from 'react-bootstrap'
import 'boxicons'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/auth";

const BookConsultation = () => {

    const [units, setUnits] = useState([])
    const [staffs, setStaffs] = useState([])
    const [timeslots, setTimeslots] = useState([
        {
            datetime: "10:00:00",
            available: true
        },
        {
            datetime: "11:00:00",
            available: true
        },
        {
            datetime: "12:00:00",
            available: true
        },
        {
            datetime: "13:00:00",
            available: true
        },
        {
            datetime: "14:00:00",
            available: true
        },
        {
            datetime: "15:00:00",
            available: true
        },
        {
            datetime: "16:00:00",
            available: true
        },
        {
            datetime: "17:00:00",
            available: true
        },
        {
            datetime: "18:00:00",
            available: false
        }
    ])
    const [date, setDate] = useState('')
    const { user } = useContext(AuthContext);



    // use to pass data to backend
    const [staffEmail, setStaffEmail] = useState('')
    const [datetime, setDateTime] = useState('')


    const handleSubmit = async e => {
        e.preventDefault()

        const data = {
            Staff_email: staffEmail,
            Student_id: user.id,
            DateTime: datetime,
            Approve: false,
            Pending: true,
            Complete: false,
            Cancel: false,
            Cancel_reason: "",
            Note: ""
        }

        axios({

            url: "https://localhost:7261/api/v1/appointment/",
            method: "POST",
            headers: {
                authorization: `Bearer ${user.token}`
            },

            data: data,
        })
            .then((res) => {
                const dt = res.data
                alert("book successfully")
                window.location.href = "/consultations"
            })
            .catch((error) => {
                console.log(error)
            });

    }

    const clear = () => {
    }

    const handleOnCourseChange = (e) => {
        console.log(e.target.value);
        axios({

            url: "https://localhost:7261/api/v1/Unit/" + e.target.value,
            method: "GET",
            headers: {
                authorization: `Bearer ${user.token}`
            },

            // Attaching the form data
            // data: data,
        })

            .then((res) => {
                const dt = res.data
                let units = [];
                dt.forEach(unit => {
                    units.push(
                        {
                            code: unit
                        }
                    )
                });
                setUnits(units)
            })

            .catch((error) => {
                console.log(error)
            });
    };

    const handleOnUnitChange = (e) => {
        var unit = e.target.value
        var unitArr = unit.split(' ');
        var unit_code = `${unitArr[0]} ${unitArr[1]}`

        console.log(unit_code);
        axios({

            url: "https://localhost:7261/api/v1/Unit/Staff/" + unit_code,
            method: "GET",
            headers: {
                authorization: `Bearer ${user.token}`
            },
        })

            .then((res) => {
                const dt = res.data
                let staffs = [];
                dt.forEach(email => {
                    staffs.push(
                        {
                            email: email
                        }
                    )
                });
                setStaffs(staffs)
            })

            .catch((error) => {
                // alert(error.response.data);
                console.log(error)
            });
    };

    const handleOnStaffChange = (e) => {
        // console.log(e.target.value);
        setStaffEmail(e.target.value)
    };


    const convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');

        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        return `${hours}:${minutes}`;
    }

    const isTimeSlotAvailable = (consultations, timeslot) => {

        for (let i = 1; i < consultations.length; i++) {
            let datetime = (consultations[i].DateTime).split(' ')

            let time = convertTime12to24(`${datetime[1]} ${datetime[2]}`)
            time += ":00"

            if (time == timeslot && consultations[i].Pending == true) {
                return false
            }
        }

        return true;
    }

    const handleOnDateChange = (e) => {
        setDate(e.target.value)
        let chosenDate = e.target.value
        let currTimeslots = timeslots
        let newTimeslots = []

        axios({

            // Endpoint to send files
            url: `https://localhost:7261/Time/${chosenDate}/${staffEmail}`,
            method: "GET",
            headers: {
                authorization: `Bearer ${user.token}`
            },
        })

            // Handle the response from backend here
            .then((res) => {
                const dt = res.data
                currTimeslots.forEach(timeslot => {
                    let available;


                    newTimeslots.push(
                        {
                            datetime: `${timeslot.datetime}`,
                            available: (new Date(chosenDate) >= new Date() && isTimeSlotAvailable(dt, timeslot.datetime)) ? true : false
                        }
                    )
                });
                setTimeslots(newTimeslots)

                // dt.forEach(consultation => {
                //     let datetime = (consultation.DateTime).split(' ')
                //     let date = datetime[0].split("/")
                //     console.log(`${date[2]}-${date[1]}-${date[0]}`)
                // });
            })

            .catch((error) => {
                // alert(error.response.data);
                console.log(error)
            });
    };

    const handleOnTimeSlotChange = (e) => {
        setDateTime(e.target.value)
    }

    return (
        <Container className="my-5">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="/consultation/book">
                    Book a Consultation
                </Breadcrumb.Item>
            </Breadcrumb>

            <Form onSubmit={handleSubmit}>
                <h1 className="mb-3">Book Consultation</h1>

                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="course">
                            <Form.Label>Course</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={handleOnCourseChange}>
                                <option selected></option>
                                <option disabled>[ please choose a course ]</option>
                                <option value="Bachelor of Computer Science">Bachelor of Computer Science</option>
                                <option value="Bachelor of Information and Communication Technology">Bachelor of Information and Communication Technology</option>
                                <option value="Bachelor of Engineering (Honours) (Civil)">Bachelor of Engineering (Honours) (Civil)</option>
                                <option value="Bachelor of Engineering (Honours) (Chemical)">Bachelor of Engineering (Honours) (Chemical)</option>
                                <option value="Bachelor of Media and Communication">Bachelor of Media and Communication</option>
                                <option value="Bachelor of Design (Multimedia Design)">Bachelor of Design (Multimedia Design)</option>
                                <option value="Bachelor of Design (Graphic Design)">Bachelor of Design (Graphic Design)</option>
                                <option value="Bachelor of Science (Biotechnology)">Bachelor of Science (Biotechnology)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="unit">
                            <Form.Label>Unit</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={handleOnUnitChange}>
                                <option selected></option>
                                <option disabled>[ please choose a unit ]</option>
                                {units.map((unit) => (
                                    <option value={unit.code}>{unit.code}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group className="mb-3" controlId="staff" onChange={handleOnStaffChange}>
                            <Form.Label>Staff</Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option selected></option>
                                <option disabled>[ please choose a staff ]</option>
                                {staffs.map((staff) => (
                                    <option value={staff.email}>{staff.email}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="date" onChange={handleOnDateChange}>
                    <Form.Label>Date</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><box-icon name='calendar' ></box-icon></InputGroup.Text>
                        <Form.Control
                            type="date"
                            placeholder="Enter date"
                            name='date'
                        />
                    </InputGroup>

                </Form.Group>

                <Form.Group className="mb-3" controlId="formdatetime" onChange={handleOnTimeSlotChange}>
                    <Form.Label>Choose a timeslot</Form.Label>
                    {timeslots.map((timeslot) => (
                        <Form.Check
                            type="radio"
                            id={timeslot.datetime}
                            value={(timeslot.available) ? `${date} ${timeslot.datetime}` : `${date} ${timeslot.datetime} [ full ]`}
                            label={(timeslot.available) ? `${date} ${timeslot.datetime}` : `${date} ${timeslot.datetime} [ full ]`}
                            name="timeslot"
                            disabled={timeslot.available ? false : true}
                        />
                    ))}


                </Form.Group>

                <ButtonGroup aria-label="Basic example">
                    <Button variant="secondary" onClick={clear}> Clear </Button>
                    <Button variant="primary" type="submit"> Book </Button>
                </ButtonGroup>

            </Form>
        </Container>

    )
}

export default BookConsultation