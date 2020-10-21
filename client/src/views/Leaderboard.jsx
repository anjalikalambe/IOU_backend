import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import "./GiftFavours.scss";
import { TablePagination } from "@material-ui/core";
import Loader from "../components/UI/Loader";

export default function GiveSomeone() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchLeaderboardUsers = async () => {
    await axios
      .get("/api/users/leaderboard/")
      .then((response) => {
        let users = response.data;
        setRows(users);
      })
      .catch((e) => {
        console.log("Error: " + e);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchLeaderboardUsers().then((_) => setLoading(false));
    const interval = setInterval(() => fetchLeaderboardUsers(), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="give-someone">
      <div className="justify-between" style={{ marginBottom: "30px" }}>
        <h1>Leaderboard</h1>
      </div>
      {loading && !rows.length ? (
        <Loader />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Rewards Earned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.username + index}>
                    <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.numRewards}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
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
    </div>
  );
}
