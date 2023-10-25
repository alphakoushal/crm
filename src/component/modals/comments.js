import React from "react";

const Commentmodal = () => {
function closemodal ()
{
    document.querySelector('#add-contact').classList.remove('show');
    document.querySelector('#add-contact').style.display="none";
}
    return (
        <>
            <div id="add-contact"
                className="modal fade in"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="myModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center">
                            <h4 className="modal-title" id="myModalLabel">
                                Add New Contact
                            </h4>
                            <button type="button" onClick={()=>closemodal()} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Commentmodal;