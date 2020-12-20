import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { ColumnsLeagueResults, ColumnsLeagueTable, ColumnsLeagueStats } from './Columns';
import './table.css';


export default function LeagueDataTable({ dataObj }) {
    const data = useMemo(() => dataObj, []);
    const columns = useMemo(() => ColumnsLeagueTable, []);
    const tableInstance = useTable({
        columns: columns,
        data: data,
    }, useSortBy);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
    } = tableInstance;

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    { headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            { headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        { column.isSorted ? (column.isSortedDesc ? ' (Desc)' : ' (Asc)') : '' }
                                    </span>
                                </th>
                            )) }
                        </tr>
                    )) }
                </thead>

                <tbody {...getTableBodyProps()}>
                    {
                        page && page.length > 0
                        ?
                        page.map(row => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    { row.cells.map(cell => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    }) }
                                </tr>
                            )
                        })
                        : "Loading..."
                    }
                </tbody>
            </table>
        </>
    );
}