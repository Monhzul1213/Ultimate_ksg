import React from 'react'
import { CSVLink } from 'react-csv'
import { Button } from 'antd';
export const ExportExcelCSV = ({csvData, fileName}) => {

    return (
        <Button 
         style={{
             marginTop:12,
             marginLeft: 12,
             width:'2cm',
             height:'1cm',
             color:'black', 
             marginBottom:12
             }}>
        <CSVLink 
            data={csvData} 
            filename={fileName}
            >Excel
        </CSVLink>
      </Button>
    )
}