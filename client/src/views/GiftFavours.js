import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import GiftModal from "../components/GiftModal.js";
import CloseFavourModal from "../components/CloseFavourModal";
import "./GiftFavours.scss";
import axios from "axios";
import Loader from "../components/UI/Loader";
import { TablePagination } from "@material-ui/core";
import { useStore } from "../stores/helpers/UseStore.js";

export default function GiveSomeone() {
  const [showFavourModal, setFavourShowModal] = useState(false);
  const [showResolveModal, setResolveShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { auth } = useStore();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchFavours = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/favours/owed/", {
        headers: { Authorization: auth.token },
      });
      setRows(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(`Couldn't display the favours owed by user.`);
    }
  };

  console.log(rows);

  const createFavour = () => {
    setFavourShowModal(true);
    setSelectedRow({});
  };

  const resolve = (row) => {
    setResolveShowModal(true);
    setSelectedRow(row);
  };

  useEffect(() => {
    fetchFavours();
  }, []);

  return (
    <div id="give-someone">
      <div className="justify-between" style={{ marginBottom: "30px" }}>
        <h1>Favours</h1>
        <Button variant="outlined" size="large" onClick={createFavour}>
          + Create Favour/Reward
        </Button>
      </div>
      {loading && <Loader />}
      {!rows.length && !loading ? (
        <div className="empty-state">
          <img src="/empty.png" alt="" className="empty-state__img"></img>
          <h2>You don't owe any favours!</h2>
        </div>
      ) : (
        !loading && (
          <>
            <div style={{ marginBottom: "15px" }}>
              <h3>Favours You Owe</h3>
            </div>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Open Image</TableCell>
                    <TableCell>Close Image</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row.owed_to + index}>
                        <TableCell>{row.owed_to}</TableCell>
                        <TableCell>{row.item}</TableCell>
                        <TableCell className="img-wrapper">
                          <div className="align-center">
                            {row.openImgURL ? (
                              <a href={row.openImgURL}>
                                <img
                                  className="img-favour"
                                  src={row.openImgURL}
                                  alt=""
                                />
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="img-wrapper">
                          <div className="align-center">
                            {row.closeImgURL ? (
                              <a href={row.closeImgURL}>
                                <img
                                  className="img-favour"
                                  src={row.closeImgURL}
                                  alt=""
                                />
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="align-center">
                            {row.completed ||
                            (row.openImgURL && row.closeImgURL) ? (
                              <>
                                <img
                                  className="img-favour"
                                  alt=""
                                  src={row.status}
                                />
                                <CheckCircleIcon
                                  style={{ color: "green", fontSize: "30px" }}
                                />
                              </>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => resolve(row)}
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {rows.length > 10 && (
              <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            )}
          </>
        )
      )}

      <GiftModal
        selectedRow={selectedRow}
        onClose={() => {
          setFavourShowModal(false);
          setTimeout(() => {
            setSelectedRow({});
          }, 500);
        }}
        isOpen={showFavourModal}
        createFavour={fetchFavours}
      />

      <CloseFavourModal
        selectedRow={selectedRow}
        onClose={() => {
          setResolveShowModal(false);
          setTimeout(() => {
            setSelectedRow({});
          }, 500);
        }}
        isOpen={showResolveModal}
        resolveFavour={fetchFavours}
      />
    </div>
  );
}
