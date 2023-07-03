import { Badge } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
// msg, variant, prompt
const StatusMsg = ({ status }) => {
    const [stats, setStats] = useState(status);

    useEffect(() => {
        console.log(status)
        setStats(status)
    }, [status]);

    if (stats == "pass" || stats == "pending" || stats == "nan") {
        return (
            <>
                <Badge pill bg="secondary">{stats}</Badge>
            </>)
    }
    else if (stats == "complete") {
        return (
            <>
                <Badge pill bg="success">{stats}</Badge>
            </>)
    }
    else if (stats == "approve") {
        return (
            <>
                <Badge pill bg="info">{stats}</Badge>
            </>)
    }
    else if (stats == "cancel") {
        return (
            <>
                <Badge pill bg="danger">{stats}</Badge>
            </>)
    }
}

export default StatusMsg