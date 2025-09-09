import React, { useState, useRef } from 'react';
import { DateRangePicker  } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import format from 'date-fns/format';
import { addDays} from 'date-fns';

const DateRangePickerComponent = ({setDaterangepicker}) => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);

  const ref = useRef();

  const handleSelect = (ranges) => {
    const selectedRange = ranges.selection;
    setRange([selectedRange]);
    setDaterangepicker(selectedRange);
    // ✅ Only close picker if both startDate and endDate are selected and not same
    if (
      selectedRange.startDate &&
      selectedRange.endDate &&
      selectedRange.startDate.getTime() !== selectedRange.endDate.getTime()
    ) {
      setOpen(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        className='form-select'
        readOnly
        value={`${format(range[0].startDate, 'MM/dd/yyyy')} - ${format(
          range[0].endDate,
          'MM/dd/yyyy'
        )}`}
        onClick={() => setOpen(!open)}
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          width: '250px',
        }}
      />
      {open && (
        <div style={{ position: 'absolute', zIndex: 999 }}>
          <DateRangePicker 
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={range}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePickerComponent;