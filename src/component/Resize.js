import React,{useState} from "react";
const ResizableColumn = ({ children,sortdata,keys,filterdata,filterkey }) => {
    const column =[{"width":110,"css":"","type":"","key":"APPLN.NO."},{"width":110,"css":"","type":"","key":"Title"},{"width":110,"css":"","type":"select","key":"COUNTRY"},{"width":110,"css":"","type":"","key":"PRIOTITY DATE"},{"width":110,"css":"","type":"","key":"DEADLINE - 30 mth"},{"width":110,"css":"","type":"","key":"DEADLINE - 31 mth"},{"width":110,"css":"","type":"","key":"APPLICANT NAME"},{"width":110,"css":"","type":"","key":"Unique/Dupe"},{"width":110,"css":"","type":"","key":"Gen/Non Gen"},{"width":110,"css":"","type":"","key":"Applicant Status"},{"width":110,"css":"","type":"","key":"CONTACT INFO OF"},{"width":110,"css":"","type":"","key":"CONTACT PERSON"},{"width":110,"css":"","type":"","key":"EMAIL ID"},{"width":110,"css":"","type":"","key":"Domain"},{"width":110,"css":"","type":"","key":"PH. NO."},{"width":110,"css":"","type":"","key":"Pages"},{"width":110,"css":"","type":"","key":"Claim"},{"width":110,"css":"","type":"","key":"Priority"},{"width":110,"css":"","type":"","key":"Drawings"},{"width":110,"css":"","type":"","key":"ISR"},{"width":110,"css":"","type":"","key":"REF. NO."},{"width":110,"css":"","type":"","key":"First Email Date"},{"width":110,"css":"","type":"","key":"FollowUp date"},{"width":110,"css":"","type":"","key":"Next Follow Up"},{"width":110,"css":"","type":"","key":"Pct App Status"},{"width":110,"css":"","type":"","key":"Email Status"},{"width":110,"css":"","type":"","key":"Call Status"},{"width":110,"css":"","type":"","key":"Comment"},{"width":110,"css":"","type":"","key":"Agent name"},{"width":110,"css":"","type":"","key":"Agent Email Id"},{"width":110,"css":"","type":"","key":"Agent Domain"},{"width":110,"css":"","type":"","key":"Agent Phone"},{"width":110,"css":"","type":"","key":"Previous Email Status"},{"width":110,"css":"","type":"","key":"Company"},{"width":110,"css":"","type":"","key":"IN "},{"width":110,"css":"","type":"","key":"CA "},{"width":110,"css":"","type":"","key":"CN "},{"width":110,"css":"","type":"","key":"JP "},{"width":110,"css":"","type":"","key":"AU "},{"width":110,"css":"","type":"","key":"BR "},{"width":110,"css":"","type":"","key":"US "},{"width":110,"css":"","type":"","key":"KR "},{"width":110,"css":"","type":"","key":"EP "},{"width":110,"css":"","type":"","key":"RU "},{"width":110,"css":"","type":"","key":"MX "},{"width":110,"css":"","type":"","key":"MY "},{"width":110,"css":"","type":"","key":"PH "},{"width":110,"css":"","type":"","key":"TH "},{"width":110,"css":"","type":"","key":"ID "},{"width":110,"css":"","type":"","key":"NZ "},{"width":110,"css":"","type":"","key":"ZA "},{"width":110,"css":"","type":"","key":"VN "},{"width":110,"css":"","type":"","key":"SG "},{"width":110,"css":"","type":"","key":"CO "},{"width":110,"css":"","type":"","key":"Month"},{"width":110,"css":"","type":"","key":"Sent on"},{"width":110,"css":"","type":"","key":"Cron Status"},{"width":110,"css":"","type":"","key":"Assigned"},{"width":110,"css":"","type":"","key":"Agent Unique/Dupe"},{"width":110,"css":"","type":"","key":"Agent Gen/Non Gen"}];
    const [dragging, setDragging] = useState(false);
      const [columns, setColumns] = useState([{"width":110,"css":"","type":"","key":"APPLN.NO."},{"width":110,"css":"","type":"","key":"Title"},{"width":110,"css":"","type":"select","key":"COUNTRY"},{"width":110,"css":"","type":"","key":"PRIOTITY DATE"},{"width":110,"css":"","type":"","key":"DEADLINE - 30 mth"},{"width":110,"css":"","type":"","key":"DEADLINE - 31 mth"},{"width":110,"css":"","type":"","key":"APPLICANT NAME"},{"width":110,"css":"","type":"","key":"Unique/Dupe"},{"width":110,"css":"","type":"","key":"Gen/Non Gen"},{"width":110,"css":"","type":"","key":"Applicant Status"},{"width":110,"css":"","type":"","key":"CONTACT INFO OF"},{"width":110,"css":"","type":"","key":"CONTACT PERSON"},{"width":110,"css":"","type":"","key":"EMAIL ID"},{"width":110,"css":"","type":"","key":"Domain"},{"width":110,"css":"","type":"","key":"PH. NO."},{"width":110,"css":"","type":"","key":"Pages"},{"width":110,"css":"","type":"","key":"Claim"},{"width":110,"css":"","type":"","key":"Priority"},{"width":110,"css":"","type":"","key":"Drawings"},{"width":110,"css":"","type":"","key":"ISR"},{"width":110,"css":"","type":"","key":"REF. NO."},{"width":110,"css":"","type":"","key":"First Email Date"},{"width":110,"css":"","type":"","key":"FollowUp date"},{"width":110,"css":"","type":"","key":"Next Follow Up"},{"width":110,"css":"","type":"","key":"Pct App Status"},{"width":110,"css":"","type":"","key":"Email Status"},{"width":110,"css":"","type":"","key":"Call Status"},{"width":110,"css":"","type":"","key":"Comment"},{"width":110,"css":"","type":"","key":"Agent name"},{"width":110,"css":"","type":"","key":"Agent Email Id"},{"width":110,"css":"","type":"","key":"Agent Domain"},{"width":110,"css":"","type":"","key":"Agent Phone"},{"width":110,"css":"","type":"","key":"Previous Email Status"},{"width":110,"css":"","type":"","key":"Company"},{"width":110,"css":"","type":"","key":"IN "},{"width":110,"css":"","type":"","key":"CA "},{"width":110,"css":"","type":"","key":"CN "},{"width":110,"css":"","type":"","key":"JP "},{"width":110,"css":"","type":"","key":"AU "},{"width":110,"css":"","type":"","key":"BR "},{"width":110,"css":"","type":"","key":"US "},{"width":110,"css":"","type":"","key":"KR "},{"width":110,"css":"","type":"","key":"EP "},{"width":110,"css":"","type":"","key":"RU "},{"width":110,"css":"","type":"","key":"MX "},{"width":110,"css":"","type":"","key":"MY "},{"width":110,"css":"","type":"","key":"PH "},{"width":110,"css":"","type":"","key":"TH "},{"width":110,"css":"","type":"","key":"ID "},{"width":110,"css":"","type":"","key":"NZ "},{"width":110,"css":"","type":"","key":"ZA "},{"width":110,"css":"","type":"","key":"VN "},{"width":110,"css":"","type":"","key":"SG "},{"width":110,"css":"","type":"","key":"CO "},{"width":110,"css":"","type":"","key":"Month"},{"width":110,"css":"","type":"","key":"Sent on"},{"width":110,"css":"","type":"","key":"Cron Status"},{"width":110,"css":"","type":"","key":"Assigned"},{"width":110,"css":"","type":"","key":"Agent Unique/Dupe"},{"width":110,"css":"","type":"","key":"Agent Gen/Non Gen"}]);


    const onResize = (index, width) => {

      setColumns(prevColumns => {
        const newColumns = [...prevColumns];
        newColumns[index]['width'] = width;
        return newColumns;
      });
    };
    const handleMouseDown = (event,keys) => {
      setDragging(true);
      const startX = event.pageX;
      const startWidth = columns[keys].width;
  
      const handleMouseMove = event => {
        const newWidth = startWidth + event.pageX - startX;
        onResize(keys,newWidth);
      };
  
      const handleMouseUp = () => {
        setDragging(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
  
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };
    return (
<th  style={{  background: 'white' }}> 
        <div style={{width:columns[keys].width }} className='headers'> {column[keys].key}<i className="ti ti-sort-ascending" onClick={()=>{sortdata(keys==0 ? 60 : keys)}}></i>{children}</div>
        <div
          className="resizer"
          style={{ width: '15px', height: '100%', position: 'absolute', right: '0', top: '0', cursor: 'col-resize', zIndex: '1' }}
          onMouseDown={(e)=>{handleMouseDown(e,keys)}}
        />
        <input className="filter" onKeyUp={(e)=>filterdata((filterkey),e.target.value)} type='text'></input>
        </th>
    );
  };
  
  export default ResizableColumn;