import React,{useState} from "react";
const ResizableColumn2 = ({ width, onResize, children,index,getColumnLetter,type,costtab }) => {
    const [dragging, setDragging] = useState(false);
    const handleMouseDown = event => {
      setDragging(true);
      const startX = event.pageX;
      const startWidth = width;
  
      const handleMouseMove = event => {
        const newWidth = startWidth + event.pageX - startX;
        onResize(newWidth);
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
      <th style={{
        position: "relative", // IMPORTANT for resizer positioning
        width: width,
        minWidth: width
      }} className={`fw-bolder ${(type=='cost' ? (costtab ? '' : 'hiddencol') : ' ')}`}>
        <div  style={{ width }}></div>
        {getColumnLetter(index+1)}
        <div
          className="resizer"
          style={{ width: '20px', height: '100%', position: 'absolute', right: '0', top: '0', cursor: 'col-resize', zIndex: '1' }}
          onMouseDown={handleMouseDown}
        />
      </th>
    );
  };
  
  export default ResizableColumn2;