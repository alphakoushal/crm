import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

// Clock component that updates every second for a specific timezone
const Clock = React.memo(({ timezone,country }) => {
  const [currentTime, setCurrentTime] = useState(moment.tz(timezone).format('hh:mm:ss a'));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment.tz(timezone).format('hh:mm:ss a'));
    }, 1000); // Update every second
    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [timezone]);

  return <><span  title={timezone} className='font-bold'>{currentTime}</span></>;
});

export default Clock;