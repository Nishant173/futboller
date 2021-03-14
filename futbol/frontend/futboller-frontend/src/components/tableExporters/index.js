import React from 'react'
import ReactExport from 'react-export-excel'
import { DownloadOutlined } from '@ant-design/icons'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn


function DownloadIcon() {
    return (
        <DownloadOutlined
            className="download-btn nc-icon nc-settings-gear-65 x2 icon_color"
            style={
                {
                    fontSize: 31,
                    color: "#83868d",
                    marginRight: "5px",
                    marginLeft: "9px",
                    cursor: "pointer",
                }
            }
        />
    )
}


export function ExportToExcel({
        filenameWithoutExtension="",
        sheetName="",
        data=[],
        columnInfo=[],
        columnLabelAccessor="",
        columnValueAccessor="",
    }) {
    return (
        <ExcelFile
            element={<DownloadIcon />}
            filename={filenameWithoutExtension}
            fileExtension="xlsx"
        >
            <ExcelSheet
                data={data}
                name={sheetName}
            >
                {
                    columnInfo.length > 0 ?
                        columnInfo.map((value, index) => {
                            return <ExcelColumn label={value[columnLabelAccessor]} value={value[columnValueAccessor]} />
                        })
                        : null
                }
            </ExcelSheet>
        </ExcelFile>
    )
}