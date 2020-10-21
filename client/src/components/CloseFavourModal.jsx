import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
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

export default function GiveSomeone(props) {
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

  const handleResolve = () => {
    let favour = props.selectedRow;
    const formData = new FormData();
    formData.append("favourImage", favourImage);

    let auth = localStorage.getItem("data");
    auth = JSON.parse(auth);
    let token = auth.token;

    axios
      .post("/api/favours/resolve", formData, {
        headers: { Authorization: token },
        params: { id: favour._id },
      })
      .then((res) => {
        props.resolveFavour();
        openSnackbar(res.data.message, "info");
      })
      .catch((e) => {
        openSnackbar(e.response.data.message, "error");
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
              <span className="sub-title">(THAT HAS BEEN COMPLETED)</span>
              <form className="modal">
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                ></FormControl>
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
                  onClick={handleResolve}
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
