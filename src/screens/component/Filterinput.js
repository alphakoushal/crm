const Filterinput = ({fieldname,sortdata,filterdata,id}) =>{
    return(
        <th style={{ background: "white" }}>
          <div className="headers">
          {fieldname}
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, id);
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata(id, e.target.value)}
                          type="text"
                        ></input>
        </th>
    )
}
export default Filterinput;