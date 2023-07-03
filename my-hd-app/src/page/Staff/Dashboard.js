import React, { useContext } from 'react';
import { Container } from 'react-bootstrap'
import { AuthContext } from "../../context/auth";

const Home = () => {
    const { staff } = useContext(AuthContext);

    return (
        <Container className="my-5">
            <p><box-icon name='wink-smile'></box-icon> Hi, <strong>{staff.email}</strong>. Welcome to meeting hour. </p>
        </Container>
    )
}

export default Home