import React from 'react'
import ReactLoading from 'react-loading'

export function Loader() {
    return (
        <div
            className="loader"
            style={
                {
                    marginLeft: '47.5%',
                    marginTop: '5%',
                }
            }
        >
            <ReactLoading
                type="bars"
                color="grey"
            />
        </div>
    )
}