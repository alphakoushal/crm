import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Toast = ({validate,handleClose}) =>{
    return (
<Snackbar  open={validate.status} onClose={handleClose} autoHideDuration={3000}>

<MuiAlert onClose={handleClose}  elevation={6} variant="filled" color={validate.color} severity={validate.icon}>{validate.message}</MuiAlert>
</Snackbar>
)
}
export default Toast;