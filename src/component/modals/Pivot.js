import React, {
  Suspense,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import { TableVirtuoso } from "react-virtuoso";
import { useDispatch } from "react-redux";
import { pivotmodal } from "../../reducers/Style";
import { costs, standard, defaultvalue } from "../../constant/Constant";
const Pivotprocess = ({ alldata, column }) => {
  let auth = localStorage.getItem("user");
  const [newdupedata, setdupedata] = useState([]);
  const [country, setcountry] = useState([]);
  const [user, setuser] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const myPromise1 = new Promise((resolve, reject) => {
      let c = new Set(alldata.map((item) => item[3]));
      resolve(c);
    });
    const myPromise2 = new Promise((resolve, reject) => {
      let finduser = new Set(alldata.map((item) => item[column]));
      resolve(finduser);
    });

    Promise.all([myPromise1, myPromise2]).then((x) => {
      setcountry([...x[0]]);
      let b = new Promise((resolve, reject) => {
        let dupedata = [];

        let res = [...x[1]].map((e, val) => {
          let userdata = alldata.filter((item) => item[column] == e);
          let returned = getcounts(userdata);

          dupedata.push([e, returned[0],returned[1],returned[2],returned[3],returned[4],returned[5],returned[6],returned[7],returned[8],returned[9],returned[10]]);
        });
        resolve(dupedata);
      });
      b.then((response) => setdupedata(response));
    });

    document
      .querySelector("table")
      .classList.add("table", "table-bordered", "table-hover");
  }, []);
  function getcounts(alldata) {
    let s = alldata.filter((item) => item[8] == "Small");
    let sb = s.filter((item) => item[9] == "Both - Individual & Agent");
    let si = s.filter((item) => item[9] == "Individual");
    let sa = s.filter((item) => item[9] == "Agent");
    let l = alldata.filter((item) => item[8] == "Large");
    let la = l.filter((item) => item[9] == "Agent");
    let li = l.filter((item) => item[9] == "Individual");
    let lb = l.filter((item) => item[9] == "Both - Individual & Agent");
    let a = alldata.filter((item) => item[9] == "Agent");
    let i = alldata.filter((item) => item[9] == "Individual");
    let b = alldata.filter((item) => item[9] == "Both - Individual & Agent");
    return [s.length, l.length, a.length, i.length, b.length,sa.length, si.length, sb.length,la.length, li.length, lb.length];
  }
  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }

  return (
    <>
      <div
        className="modal fade filing-form show"
        id="filing-form-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="edit-modal-label"
        style={{ display: "block", "padding-left": "17px" }}
      >
        <div
          className="modal-dialog modal-xl modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <form className="form-horizontal filing-form_data">
              <div className="modal-header d-flex align-items-center">
                <h4 className="modal-title" id="myLargeModalLabel">
                  Total Filtered Record
                </h4>
                <button
                  onClick={() => {
                    dispatch(pivotmodal(false));
                  }}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body custom-table">
                <Suspense fallback={<Loading />}>
                  <TableVirtuoso
                    components={{ className: "koushal" }}
                    style={{ height: 300 }}
                    data={newdupedata}
                    fixedHeaderContent={() => (
                      <tr>
                        <th className="small">
                          <div className="headers">Name</div>
                        </th>
                        <th className="small">
                          <div className="headers">Small</div>
                        </th>
                        <th className="small">
                          <div className="headers">Large</div>
                        </th>
                        <th className="small">
                          <div className="headers">Agent</div>
                        </th>
                        <th className="small">
                          <div className="headers">Individual</div>
                        </th>
                        <th className="small">
                          <div className="headers">Both</div>
                        </th>
                        <th className="small">
                          <div className="headers">Small Agent</div>
                        </th>
                        <th className="small">
                          <div className="headers">Small Individual</div>
                        </th>
                        <th className="small">
                          <div className="headers">Small Both</div>
                        </th>
                        <th className="small">
                          <div className="headers">Large Agent</div>
                        </th>
                        <th className="small">
                          <div className="headers">Large Individual</div>
                        </th>
                        <th className="small">
                          <div className="headers">Large Both</div>
                        </th>
                        {country.map((item) => {
                          return (
                            <th className="small">
                              <div className="headers">{item}</div>
                            </th>
                          );
                        })}
                      </tr>
                    )}
                    itemContent={(index, user) => (
                      <>
                        <td className="column-value small text-break">
                          {user[0]}
                        </td>
                        <td className="column-value small text-break">
                          {user[1]}
                        </td>
                        <td className="column-value small text-break">
                          {user[2]}
                        </td>
                        <td className="column-value small text-break">
                          {user[3]}
                        </td>
                        <td className="column-value small text-break">
                          {user[4]}
                        </td>
                        <td className="column-value small text-break">
                          {user[5]}
                        </td>
                        <td className="column-value small text-break">
                          {user[6]}
                        </td>
                        <td className="column-value small text-break">
                          {user[7]}
                        </td>
                        <td className="column-value small text-break">
                          {user[8]}
                        </td>
                        <td className="column-value small text-break">
                          {user[9]}
                        </td>
                        <td className="column-value small text-break">
                          {user[10]}
                        </td>
                        <td className="column-value small text-break">
                          {user[11]}
                        </td>
                        {country.map((items, index) => {
                          return (
                            <td key={index}>
                              {
                                alldata.filter(
                                  (item) =>
                                    item[3] == items && item[column] == user[0]
                                ).length
                              }
                            </td>
                          );
                        })}
                      </>
                    )}
                  />
                </Suspense>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Pivotprocess;
