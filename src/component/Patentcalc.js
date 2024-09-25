import React, { useState, useEffect, useRef } from "react";
import Uploaddata from "../services/uploaddata";
import Fetchdata from "../services/fetchdata";
import { defaultvalue } from "../constant/Constant";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const Patentclac = ({setvalidate,selectedcountry,matter}) =>{ 
    const [restdata, setrestdata] = useState({
        loader: "hide",
        loadermessage: "Update",
        title: "",
        subject: "",
        clienttype: "",
        templatetype: "",
      });
      const [count, setcount] = useState({
        part5: [
          {
            editorData: "",
            hidebasic: "false",
            word: 0,
            p: 5,
            c: 10,
            i: 1,
            pr: 10,
            fl: "eng",
            curr: "",
          },
        ],
        part1: [
          {
            desc: "filing",
            p: "",
            c: "",
            pr: "",
            i: "",
            pc: "",
            cc: "",
            prc: "",
            pcs: "",
            ccs: "",
            prcs: "",
            pcl: "",
            ccl: "",
            prcl: "",
            mc: "",
            sc: "",
            lc: "",
            pro: "",
            trans: "",
            time: "",
          },
        ],
        part2: [
          {
            desc: "filing",
            p: "",
            c: "",
            pr: "",
            i: "",
            pc: "",
            cc: "",
            prc: "",
            pcs: "",
            ccs: "",
            prcs: "",
            pcl: "",
            ccl: "",
            prcl: "",
            mc: "",
            sc: "",
            lc: "",
            pro: "",
            trans: "",
            time: "",
          },
        ],
        part3: [
          {
            desc: "filing",
            p: "",
            c: "",
            pr: "",
            i: "",
            pc: "",
            cc: "",
            prc: "",
            pcs: "",
            ccs: "",
            prcs: "",
            pcl: "",
            ccl: "",
            prcl: "",
            mc: "",
            sc: "",
            lc: "",
            pro: "",
            trans: "",
            time: "",
          },
        ],
        part4: [
          {
            desc: "filing",
            p: "",
            c: "",
            pr: "",
            i: "",
            pc: "",
            cc: "",
            prc: "",
            pcs: "",
            ccs: "",
            prcs: "",
            pcl: "",
            ccl: "",
            prcl: "",
            mc: "",
            sc: "",
            lc: "",
            pro: "",
            trans: "",
            time: "",
          },
        ],
      });
      const [editorData, setEditorData] = useState("");
      let auth = localStorage.getItem("user");
      auth = auth != "" ? JSON.parse(auth) : { userid: "", type: "", org: "" };
      const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
      };
      const fetchrecord = async (country) => {
        let fetch = await Fetchdata.fetchformula({
          country: country,
          matter:matter,
          posttype: "fetchformula",
        }).then((response) => {
          return response;
        });
        fetch = fetch.data;
        if (fetch.success) {
          setEditorData(fetch.pointers);
          setcount(JSON.parse(fetch.data));
        }
      };
      const addNewRow = (part) => {
        const newRow = {
          desc: "filing",
          p: "",
          c: "",
          pr: "",
          i: "",
          pc: "",
          cc: "",
          prc: "",
          pcs: "",
          ccs: "",
          prcs: "",
          pcl: "",
          ccl: "",
          prcl: "",
          mc: "",
          sc: "",
          lc: "",
          pro: "",
          trans: "",
          time: "",
        };
        setcount({ ...count, [part]: [...count[part], newRow] });
      };
    
      useEffect(() => {
        setrestdata((data) => ({
          ...data,
          loader: "block",
          loadermessage: "Fetching",
        }));
        fetchrecord(selectedcountry.current);
      }, []);
    
      const submitformula = async () => {
        let formdata = {
          data: JSON.stringify(count),
          country: selectedcountry.current,
          matter:matter,
          type: "uploadformula",
          posttype: "uploadformula",
          pointers: editorData,
        };
        let submit = await Uploaddata.uploadformula(formdata).then((resposne) => {
          return resposne;
        });
    
        if (submit.data.success) {
          setvalidate((prev) => ({
            ...prev,
            status: true,
            message: submit.data.message,
            color: "success",
            icon: "success",
          }));
        } else {
          setvalidate((prev) => ({
            ...prev,
            status: false,
            message: submit.errors.error,
            color: "error",
            icon: "error",
          }));
        }
      };
    
      async function updatevalue(parent, key, value, index) {
        let nested = { ...count };
        nested[parent][index] = { ...nested[parent][index], [key]: value };
        setcount(nested);
      }
    
      const removerow = (index, s) => {
        setcount((prevRows) => {
          let up = prevRows[s].splice(index, 1);
          return { ...prevRows, [s]: prevRows[s] };
        });
      };
    const returncostoverall = (parts, s) => {
        let cost = 0;
        parts.map((item, index) => {
          if (
            s != "pro" &&
            s != "trans" &&
            parseInt(count["part5"][0]["p"]) > parseInt(item["p"]) &&
            item["p"] != "" &&
            item[`pc${s}`] != ""
          ) {
            cost =
              cost +
              (parseInt(count["part5"][0]["p"]) - parseInt(item["p"])) *
                parseInt(item[`pc${s}`]);
          }
          if (s != "pro" && s != "trans" && item[`${s == "" ? "m" : s}c`] != "") {
            cost = cost + parseInt(item[`${s == "" ? "m" : s}c`]);
          }
          if (
            s != "pro" &&
            s != "trans" &&
            parseInt(count["part5"][0]["c"]) > parseInt(item["c"]) &&
            item["c"] != "" &&
            item[`cc${s}`] != ""
          ) {
            cost =
              cost +
              (parseInt(count["part5"][0]["c"]) - parseInt(item["c"])) *
                parseInt(item[`cc${s}`]);
          }
          if (
            s != "pro" &&
            s != "trans" &&
            parseInt(count["part5"][0]["pr"]) > parseInt(item["pr"]) &&
            item["pr"] != "" &&
            item[`prc${s}`] != ""
          ) {
            cost =
              cost +
              (parseInt(count["part5"][0]["pr"]) - parseInt(item["pr"])) *
                parseInt(item[`prc${s}`]);
          }
          if (s == "pro" && item[`${s}`] != "") {
            cost = cost + parseInt(item[`${s}`]);
          }
          if (
            s == "trans" &&
            count["part5"][0]["word"] != "" &&
            item[`${s}`] != ""
          ) {
            cost =
              cost + parseInt(count["part5"][0]["word"]) * parseFloat(item[`${s}`]);
          }
        });
        return cost;
      };
      const returncost = (item, s) => {
        let cost = 0;
        if (
          parseInt(count["part5"][0]["p"]) > parseInt(item["p"]) &&
          item["p"] != "" &&
          item[`pc${s}`] != ""
        ) {
          cost =
            cost +
            (parseInt(count["part5"][0]["p"]) - parseInt(item["p"])) *
              parseInt(item[`pc${s}`]);
        }
        if (
          parseInt(count["part5"][0]["c"]) > parseInt(item["c"]) &&
          item["c"] != "" &&
          item[`cc${s}`] != ""
        ) {
          cost =
            cost +
            (parseInt(count["part5"][0]["c"]) - parseInt(item["c"])) *
              parseInt(item[`cc${s}`]);
        }
        if (
          parseInt(count["part5"][0]["pr"]) > parseInt(item["pr"]) &&
          item["pr"] != "" &&
          item[`prc${s}`] != ""
        ) {
          cost =
            cost +
            (parseInt(count["part5"][0]["pr"]) - parseInt(item["pr"])) *
              parseInt(item[`prc${s}`]);
        }
        return cost;
      };
    return(
    <>
    <div className={"body-wrapper1 custom-table "}>   
    <div className="container-fluid bootstrap-table">
    <div className="card ">
                <div className="card-body py-3 d-flex justify-content-between position-relative">
                    <div className="mb-3 mb-sm-0">
                      <h4 className="card-title fw-semibold">{defaultvalue.countriescode[selectedcountry.current].name??''} Quotation</h4>
                      <p className="card-subtitle mb-0">Overview</p>
                    </div>
                <div className="d-sm-flex d-block align-items-center justify-content-end mb-9">
                    <div className="mb-3 mx-2">
                    <label className="form-label">Filling Language</label>
                    <select  onChange={(e)=>updatevalue('part5','fl',e.target.value,'0')} className="form-select w-auto">
                      <option value=''>Choose Option</option>
                      {
                          defaultvalue.filinglang.map((item,index)=>{
                           return <option key={index} Selected={count.part5[0]['fl']==item.code ? '' : false} value={item.code}>{item.value}</option>

                        })
                      }
                    </select>
                    </div>
                    <div className="mb-3">
                    <label className="form-label">Filling Currecny</label>
                    <select  onChange={(e)=>updatevalue('part5','curr',e.target.value,'0')} className="form-select w-auto">
                      <option value=''>Choose Option</option>
                      {
                          defaultvalue.fillingcurrency.map((item,index)=>{
                           return <option key={index} Selected={count.part5[0]['curr']==item.code ? '' : false} value={item.code}>{item.value}</option>

                        })
                      }
                    </select>
                    </div>
                  </div>
                  <i onClick={(e)=>updatevalue('part5','hidebasic',(count.part5[0]['hidebasic']=='true' ? 'false' : 'true'),'0')} className={`ti ${(count.part5[0]['hidebasic']=='true' ? 'ti-eye-off' : 'ti-eye')} fs-6 text-primary`} style={{"position": "absolute","right":"15px","bottom":"0"}}></i>
                </div>
                <div className={`card-body py-3  ${(count.part5[0]['hidebasic']=='true' ? 'hide' : 'show')}`}>
                  <div className="d-flex border p-2" style={{'flexWrap': 'wrap'}}>
                  <div className="mb-3 mx-1"><label className="form-label">Pages</label><input value={count.part5[0]['p']} type="text" className="form-control" onChange={(e)=>updatevalue('part5','p',e.target.value,'0')} /></div>
                  <div className="mb-3 mx-1"><label className="form-label">Claim</label><input value={count.part5[0]['c']} type="text" className="form-control" onChange={(e)=>updatevalue('part5','c',e.target.value,'0')} /></div>
                  <div className="mb-3 mx-1"><label className="form-label">Priority</label><input value={count.part5[0]['pr']} type="text" className="form-control" onChange={(e)=>updatevalue('part5','pr',e.target.value,'0')} /></div>
                  <div className="mb-3 mx-1"><label className="form-label">ISA</label><input value={count.part5[0]['i']} type="text" className="form-control" onChange={(e)=>updatevalue('part5','i',e.target.value,'0')} /></div>
                  <div className="mb-3"><label className="form-label">Word Count</label><input value={count.part5[0]['word']} type="text" className="form-control" onChange={(e)=>updatevalue('part5','word',e.target.value,'0')} /></div>

        </div></div></div>

              <div className="card">
                <div className="card-body table-one">
                <div className="d-flex mb-1 align-items-center mb-3">
                <h4 className="card-title mb-0">FILING PHASE</h4>
                <div className="ms-auto flex-shrink-0">
                  <button onClick={()=>addNewRow('part1')} className="btn bg-primary-subtle text-primary  btn-sm" title="View Code" data-bs-toggle="modal" data-bs-target="#view-code1-modal">
                    <i className="ti ti-circle-plus fs-5 d-flex"></i>
                  </button>
                  
                  
                  
                </div>
              </div>
                    <table className="table " style={{"borderCollapse": "separate","borderSpacing":"0 1rem","marginTop": "-1rem","marginBottom": "-1rem"}}>
                        <thead>
                            <tr>
                                <th className="r-1 text-center">S.No</th>
                                <th className="r-2 text-center">Description</th>
                                <th className="r-2 text-center">Official Cost</th>
                                <th className="r-1 text-center">Professional Cost</th>
                                <th className="r-2 text-center">Timeline</th>
                            </tr>
                        </thead>
                        <tbody className="mt-2">
                            {count.part1.map((item,index) => {
                            return <tr key={index} id="addRow">
                                <td className="col-xs-2 text-center">{index+1}</td>
                                <td className="col-xs-6">
                                    <table className="table pb-0 mb-0">
                                        <tbody>
                                            <tr><td colSpan='4'><input className="form-control addPrefer" value={item.desc} type="text" onChange={(e)=>{updatevalue('part1','desc',e.target.value,index)}}  /></td></tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex01">
                                                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Pages:</label>
                                                    <input className="form-control page-no" type="text" value={item.p} onChange={(e)=>{updatevalue('part1','p',e.target.value,index)}}/>
                                                </div>

                                            </td>
                                            <td>
                                                <div className="d-flex01">
                                                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim:</label>
                                                    <input className="form-control page-no" type="text" value={item.c} onChange={(e)=>{updatevalue('part1','c',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex01">
                                                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority:</label>
                                                    <input className="form-control page-no" type="text" value={item.pr} onChange={(e)=>{updatevalue('part1','pr',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex01">
                                                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">ISA:</label>
                                                    <input className="form-control page-no" type="text" value={item.i} onChange={(e)=>{updatevalue('part1','i',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    </td>
                                <td className="col-xs-6">
                                    <table className="table2 table pb-0 mb-0">
                                        <tbody><tr>
                                            <td>
                                                <div className="h-table">
                                                <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Micro Standard Cost :</label><input className="form-control page-no2" type="text" value={item.mc} onChange={(e)=>{updatevalue('part1','mc',e.target.value,index)}}/></div>
                                                    <div className="d-flex02">
                                                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pc} onChange={(e)=>{updatevalue('part1','pc',e.target.value,index)}}/></div>
                                                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.cc} onChange={(e)=>{updatevalue('part1','cc',e.target.value,index)}}/></div>
                                                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prc} onChange={(e)=>{updatevalue('part1','prc',e.target.value,index)}}/></div>
                                                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'')}/></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                            <div className="h-table">
                                            <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Small Standard Cost :</label><input className="form-control page-no2" type="text" value={item.sc} onChange={(e)=>{updatevalue('part1','sc',e.target.value,index)}}/></div>
                                                    <div className="d-flex02">
                                                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pcs} onChange={(e)=>{updatevalue('part1','pcs',e.target.value,index)}}/></div>
                                                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.ccs} onChange={(e)=>{updatevalue('part1','ccs',e.target.value,index)}}/></div>
                                                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prcs} onChange={(e)=>{updatevalue('part1','prcs',e.target.value,index)}}/></div>
                                                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'s')}/></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                            <div className="h-table">
                                            <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Large Standard Cost :</label><input className="form-control page-no2" type="text" value={item.lc} onChange={(e)=>{updatevalue('part1','lc',e.target.value,index)}}/></div>
                                                    <div className="d-flex02">
                                                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pcl} onChange={(e)=>{updatevalue('part1','pcl',e.target.value,index)}}/></div>
                                                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.ccl} onChange={(e)=>{updatevalue('part1','ccl',e.target.value,index)}}/></div>
                                                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prcl} onChange={(e)=>{updatevalue('part1','prcl',e.target.value,index)}}/></div>
                                                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'l')}/></div>
                                                    </div>
                                                </div>
                                            </td>

                                        </tr>


                                    </tbody></table>
                                </td>
                                <td className="col-xs-6">
                                    <input className="form-control text-center addPrefer" type="text" value={item.pro} onChange={(e)=>{updatevalue('part1','pro',e.target.value,index)}}/>
                                </td>
                                <td className="col-xs-6">
                                    <input className="form-control text-center addPrefer px-0" type="text" value={item.time} onChange={(e)=>{updatevalue('part1','time',e.target.value,index)}}/>
                                </td>
<i onClick={()=>{removerow(index,'part1')}} className="ti ti-square-rounded-x-filled p-0"></i>
                            </tr>
                            })
                        }
                        <tr id="addRow">
                                <td className="col-xs-6 div_1 text-center">
                                </td>
                                <td className="col-xs-6 div_1 text-center">
                                </td>
                                <td className="col-xs-6">
                                    <table className="table2 table pb-0 mb-0">
                                        <tbody><tr>
                                            <td>
                                                <div className="h-table-b ">
                                                    <p className="mb-0 text-center">Total</p>
                                                        <input value={returncostoverall(count.part1,'')} className="form-control" type="text" disabled/>   
                                                </div>
                                            </td>
                                            <td>
                                                <div className="h-table-b ">
                                                    <p className="mb-0 text-center">Total</p>
                                                        <input value={returncostoverall(count.part1,'s')} className="form-control" type="text" disabled/>                  
                                                </div>
                                            </td>
                                            <td>
                                                <div className="h-table-b ">
                                                  <p className="mb-0 text-center">Total</p>
                                                        <input value={returncostoverall(count.part1,'l')} className="form-control" type="text" disabled/>                                          
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody></table>
                                </td>
                                <td className="col-xs-6">
                                    <div className="h-total">
                                    <p className="mb-0 text-center">Total</p>
                                    <input className="form-control text-center addPrefer" value={returncostoverall(count.part1,'pro')} type="text" disabled/>
                                    </div>
                                </td>
                                <td className="col-xs-6">
                                     {/* <div className="h-total">
                                    <p className="mb-0 text-center">Total</p>
                                    <input className="form-control text-center addPrefer" value={returncostoverall(count.part1,'trans')} type="text" disabled/>
                                       </div> */}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div></div>
                    <div className="card">
                <div className="card-body table-one">
                <div className="d-flex mb-1 align-items-center mb-3">
                <h4 className="card-title mb-0">EXAMINATION PHASE</h4>
                <div className="ms-auto flex-shrink-0">
                  <button onClick={()=>addNewRow('part2')} className="btn bg-primary-subtle text-primary  btn-sm" title="View Code" data-bs-toggle="modal" data-bs-target="#view-code1-modal">
                    <i className="ti ti-circle-plus fs-5 d-flex"></i>
                  </button>
                </div>
              </div>
                <table className="table" style={{"borderCollapse": "separate","borderSpacing":"0 1rem","marginTop": "-1rem","marginBottom": "-1rem"}}>
<thead>
    <tr>
        <th className="r-1 text-center">S.No</th>
        <th className="r-2 text-center">Description</th>
        <th className="r-2 text-center">Official Cost</th>
        <th className="r-1 text-center">Professional Cost</th>
        <th className="r-2 text-center">Timeline</th>
    </tr>
</thead>
<tbody className="mt-2">
    {count.part2.map((item,index) => {
return <tr key={index} id="addRow">
<td className="col-xs-2 text-center">{index+1}</td>
<td className="col-xs-6">
    <table className="table pb-0 mb-0">
        <tbody>
            <tr><td colSpan='4'><input className="form-control addPrefer" value={item.desc} type="text" onChange={(e)=>{updatevalue('part2','desc',e.target.value,index)}}  /></td></tr>
        <tr>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Pages:</label>
                    <input className="form-control page-no" type="text" value={item.p} onChange={(e)=>{updatevalue('part2','p',e.target.value,index)}}/>
                </div>

            </td>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim:</label>
                    <input className="form-control page-no" type="text" value={item.c} onChange={(e)=>{updatevalue('part2','c',e.target.value,index)}}/>
                </div>
            </td>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority:</label>
                    <input className="form-control page-no" type="text" value={item.pr} onChange={(e)=>{updatevalue('part2','pr',e.target.value,index)}}/>
                </div>
            </td>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">ISA:</label>
                    <input className="form-control page-no" type="text" value={item.i} onChange={(e)=>{updatevalue('part2','i',e.target.value,index)}}/>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
    </td>
<td className="col-xs-6">
    <table className="table2 table pb-0 mb-0">
        <tbody><tr>
            <td>
                <div className="h-table">
                <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Micro Standard Cost :</label><input className="form-control page-no2" type="text" value={item.mc} onChange={(e)=>{updatevalue('part2','mc',e.target.value,index)}}/></div>
                    <div className="d-flex02">
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pc} onChange={(e)=>{updatevalue('part2','pc',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.cc} onChange={(e)=>{updatevalue('part2','cc',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prc} onChange={(e)=>{updatevalue('part2','prc',e.target.value,index)}}/></div>
                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'')}/></div>
                    </div>
                </div>
            </td>
            <td>
            <div className="h-table">
            <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Small Standard Cost :</label><input className="form-control page-no2" type="text" value={item.sc} onChange={(e)=>{updatevalue('part2','sc',e.target.value,index)}}/></div>
                    <div className="d-flex02">
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pcs} onChange={(e)=>{updatevalue('part2','pcs',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.ccs} onChange={(e)=>{updatevalue('part2','ccs',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prcs} onChange={(e)=>{updatevalue('part2','prcs',e.target.value,index)}}/></div>
                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'s')}/></div>
                    </div>
                </div>
            </td>
            <td>
            <div className="h-table">
                    <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Large Standard Cost :</label><input className="form-control page-no2" type="text" value={item.lc} onChange={(e)=>{updatevalue('part2','lc',e.target.value,index)}}/></div>
                    <div className="d-flex02">
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pcl} onChange={(e)=>{updatevalue('part2','pcl',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.ccl} onChange={(e)=>{updatevalue('part2','ccl',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prcl} onChange={(e)=>{updatevalue('part2','prcl',e.target.value,index)}}/></div>
                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'l')}/></div>
                    </div>
                </div>
            </td>

        </tr>


    </tbody></table>
</td>
<td className="col-xs-6">
    <input className="form-control text-center addPrefer" type="text" value={item.pro} onChange={(e)=>{updatevalue('part2','pro',e.target.value,index)}}/>
</td>
<td className="col-xs-6">
    <input className="form-control text-center addPrefer px-0" type="text" value={item.time} onChange={(e)=>{updatevalue('part2','time',e.target.value,index)}}/>
</td>
<i onClick={()=>{removerow(index,'part2')}} className="ti ti-square-rounded-x-filled p-0"></i>
</tr>
    })
}
<tr id="addRow">
                                <td className="col-xs-6 div_1 text-center">
                                </td>
                                <td className="col-xs-6 div_1 text-center">
                                </td>
                                <td className="col-xs-6">
                                    <table className="table2 table pb-0 mb-0">
                                        <tbody><tr>
                                            <td>
                                                <div className="h-table-b ">
                                                    <p className="mb-0 text-center">Total</p>
                                                        <input className="form-control" value={returncostoverall(count.part2,'')} type="text" disabled/>   
                                                </div>
                                            </td>
                                            <td>
                                                <div className="h-table-b ">
                                                    <p className="mb-0 text-center">Total</p>
                                                        <input className="form-control" value={returncostoverall(count.part2,'s')} type="text" disabled/>                  
                                                </div>
                                            </td>
                                            <td>
                                                <div className="h-table-b ">
                                                  <p className="mb-0 text-center">Total</p>
                                                        <input className="form-control" value={returncostoverall(count.part2,'l')} type="text" disabled/>                                          
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody></table>
                                </td>
                                <td className="col-xs-6">
                                    <div className="h-total">
                                    <p className="mb-0 text-center">Total</p>
                                    <input className="form-control text-center addPrefer" value={returncostoverall(count.part2,'pro')} type="text" disabled/>
                                    </div>
                                </td>
                                <td className="col-xs-6">

                                </td>
                            </tr>
</tbody>
</table>
</div></div>
<div className="card">
                <div className="card-body table-one">
                <div className="d-flex mb-1 align-items-center mb-3">
                <h4 className="card-title mb-0">GRANT PHASE</h4>
                <div className="ms-auto flex-shrink-0">
                  <button onClick={()=>addNewRow('part3')} className="btn bg-primary-subtle text-primary  btn-sm" title="View Code" data-bs-toggle="modal" data-bs-target="#view-code1-modal">
                    <i className="ti ti-circle-plus fs-5 d-flex"></i>
                  </button>
                </div>
              </div>
                <table className="table" style={{"borderCollapse": "separate","borderSpacing":"0 1rem","marginTop": "-1rem","marginBottom": "-1rem"}}>
<thead>
    <tr>
        <th className="r-1 text-center">S.No</th>
        <th className="r-2 text-center">Description</th>
        <th className="r-2 text-center">Official Cost</th>
        <th className="r-1 text-center">Professional Cost</th>
        <th className="r-2 text-center">Timeline</th>
    </tr>
</thead>
<tbody className="mt-2">
    {count.part3.map((item,index) => {
return <tr key={index} id="addRow">
<td className="col-xs-2 text-center">{index+1}</td>
<td className="col-xs-6">
    <table className="table pb-0 mb-0">
        <tbody>
            <tr><td colSpan='4'><input className="form-control addPrefer" value={item.desc} type="text" onChange={(e)=>{updatevalue('part3','desc',e.target.value,index)}}  /></td></tr>
        <tr>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Pages:</label>
                    <input className="form-control page-no" type="text" value={item.p} onChange={(e)=>{updatevalue('part3','p',e.target.value,index)}}/>
                </div>

            </td>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim:</label>
                    <input className="form-control page-no" type="text" value={item.c} onChange={(e)=>{updatevalue('part3','c',e.target.value,index)}}/>
                </div>
            </td>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority:</label>
                    <input className="form-control page-no" type="text" value={item.pr} onChange={(e)=>{updatevalue('part3','pr',e.target.value,index)}}/>
                </div>
            </td>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">ISA:</label>
                    <input className="form-control page-no" type="text" value={item.i} onChange={(e)=>{updatevalue('part3','i',e.target.value,index)}}/>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
    </td>
<td className="col-xs-6">
    <table className="table2 table pb-0 mb-0">
        <tbody><tr>
            <td>
                <div className="h-table">
                <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Micro Standard Cost :</label><input className="form-control page-no2" type="text" value={item.mc} onChange={(e)=>{updatevalue('part3','mc',e.target.value,index)}}/></div>
                    <div className="d-flex02">
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pc} onChange={(e)=>{updatevalue('part3','pc',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.cc} onChange={(e)=>{updatevalue('part3','cc',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prc} onChange={(e)=>{updatevalue('part3','prc',e.target.value,index)}}/></div>
                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'')}/></div>
                    </div>
                </div>
            </td>
            <td>
            <div className="h-table">
            <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Small Standard Cost :</label><input className="form-control page-no2" type="text" value={item.sc} onChange={(e)=>{updatevalue('part3','sc',e.target.value,index)}}/></div>
                    <div className="d-flex02">
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pcs} onChange={(e)=>{updatevalue('part3','pcs',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.ccs} onChange={(e)=>{updatevalue('part3','ccs',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prcs} onChange={(e)=>{updatevalue('part3','prcs',e.target.value,index)}}/></div>
                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'s')}/></div>
                    </div>
                </div>
            </td>
            <td>
            <div className="h-table">
            <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Large Standard Cost :</label><input className="form-control page-no2" type="text" value={item.lc} onChange={(e)=>{updatevalue('part3','lc',e.target.value,index)}}/></div>
                    <div className="d-flex02">
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pcl} onChange={(e)=>{updatevalue('part3','pcl',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.ccl} onChange={(e)=>{updatevalue('part3','ccl',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prcl} onChange={(e)=>{updatevalue('part3','prcl',e.target.value,index)}}/></div>
                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'l')}/></div>
                    </div>
                </div>
            </td>

        </tr>


    </tbody></table>
</td>
<td className="col-xs-6">
    <input className="form-control text-center addPrefer" type="text" value={item.pro} onChange={(e)=>{updatevalue('part3','pro',e.target.value,index)}}/>
</td>
<td className="col-xs-6">
    <input className="form-control text-center addPrefer px-0" type="text" value={item.time} onChange={(e)=>{updatevalue('part3','time',e.target.value,index)}}/>
</td>
<i onClick={()=>{removerow(index,'part3')}} className="ti ti-square-rounded-x-filled p-0"></i>
</tr>
    })
}
<tr id="addRow">
                                <td className="col-xs-6 div_1 text-center">
                                </td>
                                <td className="col-xs-6 div_1 text-center">
                                </td>
                                <td className="col-xs-6">
                                    <table className="table2 table pb-0 mb-0">
                                        <tbody><tr>
                                            <td>
                                                <div className="h-table-b ">
                                                    <p className="mb-0 text-center">Total</p>
                                                        <input className="form-control" value={returncostoverall(count.part3,'')} type="text" disabled/>   
                                                </div>
                                            </td>
                                            <td>
                                                <div className="h-table-b ">
                                                    <p className="mb-0 text-center">Total</p>
                                                        <input className="form-control" value={returncostoverall(count.part3,'s')} type="text" disabled/>                  
                                                </div>
                                            </td>
                                            <td>
                                                <div className="h-table-b ">
                                                  <p className="mb-0 text-center">Total</p>
                                                        <input className="form-control" value={returncostoverall(count.part3,'l')} type="text" disabled/>                                          
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody></table>
                                </td>
                                <td className="col-xs-6">
                                    <div className="h-total">
                                    <p className="mb-0 text-center">Total</p>
                                    <input className="form-control text-center addPrefer" value={returncostoverall(count.part3,'pro')} type="text" disabled/>
                                    </div>
                                </td>
                                <td className="col-xs-6">

                                </td>
                            </tr>
</tbody>
</table>
</div></div>
<div className="card">
                <div className="card-body table-one">
                <div className="d-flex mb-1 align-items-center mb-3">
                <h4 className="card-title mb-0">ANNUITY PHASE</h4>
                <div className="ms-auto flex-shrink-0">
                  <button onClick={()=>addNewRow('part4')} className="btn bg-primary-subtle text-primary  btn-sm" title="View Code" data-bs-toggle="modal" data-bs-target="#view-code1-modal">
                    <i className="ti ti-circle-plus fs-5 d-flex"></i>
                  </button>
                </div>
              </div>
                <table className="table" style={{"borderCollapse": "separate","borderSpacing":"0 1rem","marginTop": "-1rem","marginBottom": "-1rem"}}>
<thead>
    <tr>
        <th className="r-1 text-center">S.No</th>
        <th className="r-2 text-center">Description</th>
        <th className="r-2 text-center">Official Cost</th>
        <th className="r-1 text-center">Professional Cost</th>
        <th className="r-2 text-center">Timeline</th>
    </tr>
</thead>
<tbody className="mt-2">
    {count.part4.map((item,index) => {
return <tr key={index} id="addRow">
<td className="col-xs-2 text-center">{index+1}</td>
<td className="col-xs-6">
    <table className="table pb-0 mb-0">
        <tbody>
            <tr><td colSpan='4'><input className="form-control addPrefer" value={item.desc} type="text" onChange={(e)=>{updatevalue('part4','desc',e.target.value,index)}}  /></td></tr>
        <tr>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Pages:</label>
                    <input className="form-control page-no" type="text" value={item.p} onChange={(e)=>{updatevalue('part4','p',e.target.value,index)}}/>
                </div>

            </td>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim:</label>
                    <input className="form-control page-no" type="text" value={item.c} onChange={(e)=>{updatevalue('part4','c',e.target.value,index)}}/>
                </div>
            </td>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority:</label>
                    <input className="form-control page-no" type="text" value={item.pr} onChange={(e)=>{updatevalue('part4','pr',e.target.value,index)}}/>
                </div>
            </td>
            <td>
                <div className="d-flex01">
                    <label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">ISA:</label>
                    <input className="form-control page-no" type="text" value={item.i} onChange={(e)=>{updatevalue('part4','i',e.target.value,index)}}/>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
    </td>
<td className="col-xs-6">
    <table className="table2 table pb-0 mb-0">
        <tbody><tr>
            <td>
                <div className="h-table">
                <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Micro Standard Cost :</label><input className="form-control page-no2" type="text" value={item.mc} onChange={(e)=>{updatevalue('part4','mc',e.target.value,index)}}/></div>
                    <div className="d-flex02">
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pc} onChange={(e)=>{updatevalue('part4','pc',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.cc} onChange={(e)=>{updatevalue('part4','cc',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prc} onChange={(e)=>{updatevalue('part4','prc',e.target.value,index)}}/></div>
                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'')}/></div>
                    </div>
                </div>
            </td>
            <td>
            <div className="h-table">
            <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Small Standard Cost :</label><input className="form-control page-no2" type="text" value={item.sc} onChange={(e)=>{updatevalue('part4','sc',e.target.value,index)}}/></div>
                    <div className="d-flex02">
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pcs} onChange={(e)=>{updatevalue('part4','pcs',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.ccs} onChange={(e)=>{updatevalue('part4','ccs',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prcs} onChange={(e)=>{updatevalue('part4','prcs',e.target.value,index)}}/></div>
                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'s')}/></div>
                    </div>
                </div>
            </td>
            <td>
            <div className="h-table">
                    <div className="d-flex01"><label htmlFor="example-text-input" className="p-0 col-form-label">Large Standard Cost :</label><input className="form-control page-no2" type="text" value={item.lc} onChange={(e)=>{updatevalue('part4','lc',e.target.value,index)}}/></div>
                    <div className="d-flex02">
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Page Cost:</label><input className="form-control page-no2" type="text" value={item.pcl} onChange={(e)=>{updatevalue('part4','pcl',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Claim Cost:</label><input className="form-control page-no2" type="text" value={item.ccl} onChange={(e)=>{updatevalue('part4','ccl',e.target.value,index)}}/></div>
                    <div className="d-flex01"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">Priority Cost:</label><input className="form-control page-no2" type="text" value={item.prcl} onChange={(e)=>{updatevalue('part4','prcl',e.target.value,index)}}/></div>
                    <div className="d-flex02"><label htmlFor="example-text-input" className="col-md-2 p-0 col-form-label">= &nbsp; </label><input className="form-control page-no2" type="text" disabled="disabled" value={returncost(item,'l')}/></div>
                    </div>
                </div>
            </td>

        </tr>


    </tbody></table>
</td>
<td className="col-xs-6">
    <input className="form-control text-center addPrefer" type="text" value={item.pro} onChange={(e)=>{updatevalue('part4','pro',e.target.value,index)}}/>
</td>
<td className="col-xs-6">
    <input className="form-control text-center addPrefer px-0" type="text" value={item.time} onChange={(e)=>{updatevalue('part4','time',e.target.value,index)}}/>
</td>
<i onClick={()=>{removerow(index,'part4')}} className="ti ti-square-rounded-x-filled p-0"></i>
</tr>
    })
}
<tr id="addRow">
                                <td className="col-xs-6 div_1 text-center">
                                </td>
                                <td className="col-xs-6 div_1 text-center">
                                </td>
                                <td className="col-xs-6">
                                    <table className="table2 table pb-0 mb-0">
                                        <tbody><tr>
                                            <td>
                                                <div className="h-table-b ">
                                                    <p className="mb-0 text-center">Total</p>
                                                        <input className="form-control" value={returncostoverall(count.part4,'')} type="text" disabled/>   
                                                </div>
                                            </td>
                                            <td>
                                                <div className="h-table-b ">
                                                    <p className="mb-0 text-center">Total</p>
                                                        <input className="form-control" value={returncostoverall(count.part4,'s')} type="text" disabled/>                  
                                                </div>
                                            </td>
                                            <td>
                                                <div className="h-table-b ">
                                                  <p className="mb-0 text-center">Total</p>
                                                        <input className="form-control" value={returncostoverall(count.part4,'l')} type="text" disabled/>                                          
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody></table>
                                </td>
                                <td className="col-xs-6">
                                    <div className="h-total">
                                    <p className="mb-0 text-center">Total</p>
                                    <input className="form-control text-center addPrefer" value={returncostoverall(count.part4,'pro')} type="text" disabled/>
                                    </div>
                                </td>
                                <td className="col-xs-6">

                                </td>
                            </tr>
</tbody>
</table>
<div className="col-12">
<h4 className="card-title mb-0">Additonal Pointer</h4>
                        <div className="country-ck align-items-center mt-3">
                          <div className="form-check">
                          <CKEditor
                    editor={ ClassicEditor }
                    config={ {
                        toolbar: ["undo","redo","|","heading","|","bold","italic","|","link","uploadImage","insertTable","blockQuote","mediaEmbed","|","bulletedList","numberedList","outdent","indent"]
                    } }
                    data={editorData??''}
                    onReady={ editor => {
                    } }
                    onChange={handleEditorChange}
                    onBlur={ ( event, editor ) => {
                    } }
                    onFocus={ ( event, editor ) => {
                    } }
                />
                          </div>
                        
                        </div>
                      </div>
                    <div className="col-12 d-flex"><div className="m-auto mt-3"><button type="submit" onClick={()=>submitformula()} className="btn btn-info font-medium rounded-pill px-4"><div className="d-flex align-items-center"><i className="ti ti-send me-2 fs-4"></i>Update<i className="ti ti-refresh rotate ms-2 hide"></i></div></button></div></div>
                    </div>
                </div>

          </div></div></>);
}
export default Patentclac;