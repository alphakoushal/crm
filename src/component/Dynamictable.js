import React, { useState } from 'react';

// Table component
const DynamicTable = ({ tableData, updateTable }) => {
  const addRow = () => {
    const newRow = Array(tableData.columns.length).fill('');
    updateTable([...tableData.rows, newRow],'rows');
  };

  const updatecolumnCell = (colIndex, value) => {
    const newRows = [...tableData.columns];
    newRows[colIndex] = value;
    updateTable(newRows,'columns');
  };
  const updateCell = (rowIndex, colIndex, value) => {
    const newRows = [...tableData.rows];
    newRows[rowIndex][colIndex] = value;
    updateTable(newRows,'rows');
  };

  return (
            <div className="col-lg-12 d-flex align-items-stretch">
              <div className="card w-100">
                <div className="card-body">
                <div className="d-sm-flex d-block align-items-center justify-content-between mb-7">
                    <div className="mb-3 mb-sm-0">
                      <h4 className="card-title fw-semibold">{tableData.title}</h4>
                    </div>
                    <div>
                    <button onClick={addRow} className="btn bg-primary-subtle text-primary  btn-sm" title="View Code"><i className="ti ti-circle-plus fs-5 d-flex"></i></button>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table align-middle text-nowrap mb-0">
                      <thead>
                        <tr className="text-muted fw-semibold">
                        {tableData.columns.map((col, colIndex) => (
              <th key={colIndex}> 
              <div class="form-floating mb-3"><input
              type="text"
              className='form-control'
              value={col}
              onChange={(e) => updatecolumnCell(colIndex, e.target.value)}
            /><label for="tb-fname">Header</label></div>
              </th>
            ))}
                        </tr>
                      </thead>
                      <tbody className="border-top">
                      {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    className='form-control'
                    value={cell}
                    onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
  );
};
export default DynamicTable;