import { Alert } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
// msg, variant, prompt
const AlertMessage = (props) => {
    const [show, setShow] = useState(props.prompt);
    
    useEffect(() => {
        setShow(props.prompt)
    }, [props]);
    
    if (show) {
        return (
                <Alert
                    variant={props.variant}
                    style={{
                        position: "fixed",
                        bottom: "10px",
                        right: "10px",
                      }}
                    onClose={() => setShow(false)} dismissible>
                    {props.msg}
                </Alert>
        );
    }
}

export default AlertMessage