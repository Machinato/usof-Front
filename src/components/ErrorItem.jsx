import React, { useState } from "react";

const ErrorItem = (props) => {
    return (
        <div className="post">
            <div className="post_content">
                <strong>
                    {props.error.msg}
                </strong>
            </div>
        </div>
    );
}

export default ErrorItem;