import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { DataGrid } from '@material-ui/data-grid'

import { addUniqueField } from '../../jsUtils/general'


export function BasicTable({ arrayOfObjects }) {
    const columnNames = Object.keys(arrayOfObjects[0])
    const classes = makeStyles({
        table: {
            minWidth: 650,
        },
    })

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {
                            columnNames.map((columnName) => (
                                <TableCell align="center">{ columnName }</TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        arrayOfObjects.map((obj) => (
                            <TableRow>
                                {
                                    columnNames.map((columnName) => (
                                        <TableCell align="center">{ obj[columnName] }</TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}


export function GridTable({ title="", arrayOfObjects, columnsData, pageSize=5 }) {
    const existingFields = Object.keys(arrayOfObjects[0])
    if (!existingFields.includes("id")) {
        arrayOfObjects = addUniqueField(arrayOfObjects, "id")
    }

    return (
        <div style={{ height: 380, width: '100%' }}>
            <h2>{title}</h2>
            <DataGrid
                rows={arrayOfObjects}
                columns={columnsData}
                pageSize={pageSize}
            />
        </div>
    )
}