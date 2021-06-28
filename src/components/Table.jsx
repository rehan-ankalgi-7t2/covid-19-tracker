import React from 'react'
import '../css/table.css'

const Table = ({ countries }) => {
    return (
        <div className="table">
            <tr className="table__head">
                <td>Country</td>
                <td>Cases</td>
            </tr>
            
            {countries.map(({country ,cases}) => (
                <tr className="table__row">
                    <td>{country}</td>
                    <td><strong>{cases}</strong></td>
                </tr>
            ))}
        </div>
    )
}

export default Table
