import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    border: "none",
    backgroundColor: "white",
    padding: "25px 30px",
    borderRadius: "4px",
  },
}));

export default function ResolvePublicReq(props) {
  const classes = useStyles();
  const [file, setFile] = useState("");
  const [favourImage, setFavourImage] = useState("");

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const { open, message, type } = snackbarState;

  const openSnackbar = (message, type = "info") => {
    setSnackbarState({ open: true, message, type });
  };
  const closeSnackbar = () => {
    setSnackbarState({ open: false, message, type });
  };

  const handleClose = () => {
    props.onClose();
    setFile("");
  };

  const handleFile = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]));
    setFavourImage(e.target.files[0]);

  };

  const handleSave = () => {
    let favour = props.selectedRow;
    const id = favour._id;
    const formData = new FormData();
    formData.append("favourImage", favourImage);
    formData.append("id", id);
    formData.append("opened_by", favour.opened_by);
    formData.append("rewards", JSON.stringify(favour.rewards));

    let data = {
      id
    }
    let token = JSON.parse(localStorage.getItem('data')).token;

    axios.post("/api/favours/createRequestRewards", formData,{ headers: { 'Authorization': token } })
      .then(() => {console.log("Created rewards")})
      .catch(e => console.log("Could not create rewards"));
    
    axios.post("/api/public/requests/delete", data,{ headers: { 'Authorization': token } })
      .then(res => {
        console.log("Sucessfully resolved request")
        openSnackbar(res.data.message, "info");
        props.requestResolved();
      })
      .catch(e => {
        openSnackbar(e.response.data.message, "error");
        console.log("Could not resolve request")
      });

    handleClose();
  };

  return (
    <div id="giftModal">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={closeSnackbar}
        key={"topright"}
        autoHideDuration={4000}
      >
        <Alert onClose={closeSnackbar} severity={type}>
          {message}
        </Alert>
      </Snackbar>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.isOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <div className={classes.paper}>
            <div>
              <h2 id="transition-modal-title">Resolve Favour</h2>
              <form className="modal">
                {file ? (
                  <img
                    alt=""
                    src={file}
                    style={{
                      maxHeight: "350px",
                      marginBottom: "20px",
                      maxWidth: "800px",
                      width: "auto",
                    }}
                  />
                ) : null}
                <input type="file" onChange={(e) => handleFile(e)} />
              </form>
              <div className="flex justify-between">
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!file}
                >
                  Resolve
                </Button>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
