import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
const Filterselect = ({sortdata,fieldname,event,values,defaultv}) =>{
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 5;
    const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 50,
          },
        },
      };
    return (
        <th style={{ background: "white" }}>
        <div className="headers">
        {fieldname}
          <i
            className="ti ti-sort-ascending"
            onClick={(e) => {
              sortdata(e, 9);
            }}
          ></i>{" "}
        </div>

        <FormControl sx={{ m: 0, width: "100%" }}>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={values}
            onChange={event}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {defaultv.map((name) => (
              <MenuItem key={name.key} value={name.key}>
                {name.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </th>
    )
}
export default Filterselect;