import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Toast = ({validate}) =>{
    return (
<Snackbar open={validate.status} autoHideDuration={6000}>

<MuiAlert elevation={6} variant="filled" color={validate.color} severity={validate.icon}>{validate.message}</MuiAlert>
</Snackbar>
)
}
export default Toast;