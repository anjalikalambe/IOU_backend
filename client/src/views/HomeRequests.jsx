import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { TablePagination, TextField } from "@material-ui/core";
import HomeNav from "../components/HomeNav";
import "./HomeRequests.scss";
import Loader from '../components/UI/Loader'

export default function HomeRequests() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 9));
    setPage(0);
  };

  const fetchPublicRequests = () => {
    setLoading(true);
    axios
      .get("/api/public/requests/")
      .then((response) => {
        setLoading(false);
        const requests = response.data;
        setRows(requests);
        console.log("setRows(requests)");
      })
      .catch((e) => {
        setLoading(false);
        console.log("Couldn't display the public requests." + e);
      });
  };

  useEffect(() => {
    fetchPublicRequests();
  }, []);

  const filterRows = () => {
    return rows.filter((row) => {
      return (
        [...new Set(row.rewards.map((reward) => reward.item.toLowerCase()))]
          .join()
          .includes(filter) || row.description.toLowerCase().includes(filter)
      );
    });
  };

  const displayRewards = (array) => {
    if (!array.length) return <span>None</span>;
    let arr = array.map((item) => item.item);
    let map = {};
    for (let i = 0; i < arr.length; ++i) {
      map[arr[i]] ? map[arr[i]]++ : (map[arr[i]] = 1);
    }
    return Object.keys(map).map((reward, index) => {
      if (map[reward] > 1) {
        return (
          <span key={reward + (index * 1000 + map[reward])}>
            {`${reward} (x${map[reward]})`}
            {Object.keys(map).length - 1 !== index ? ", " : ""}
          </span>
        );
      } else {
        return (
          <span key={reward + (index * 1000 + map[reward])}>
            {reward}
            {Object.keys(map).length - 1 !== index ? ", " : ""}
          </span>
        );
      }
    });
  };

  return (
    <div className="flex flex-col" style={{ width: "100%" }}>
      <div className="homenav-wrapper">
        <HomeNav />
      </div>
      <div className="home-requests">
        <div
          className="justify-between align-center"
          style={{ marginBottom: "30px" }}
        >
          <h1>Public Requests</h1>
          <div className="flex justify-between align-center">
            <TextField
              label="Filter by task or reward"
              variant="outlined"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
        {loading && <Loader />}
        <Grid container spacing={3}>
          {filterRows().length
            ? filterRows()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <Grid item xs={4} key={index + Math.random(100000)}>
                    <div className="card" key={row.item + index}>
                      <div className="card--title">{row.description}</div>
                      <div className="card--body">
                        <span>Rewards: </span>
                        {displayRewards(row.rewards)}
                      </div>
                    </div>
                  </Grid>
                ))
            : !loading && (
                <div className="empty-state">
                  <img
                    src="/empty.png"
                    alt=""
                    className="empty-state__img"
                  ></img>
                  <h2>Could not find any public requests</h2>
                </div>
              )}
        </Grid>
        {filterRows().length > 9 && (
          <TablePagination
            rowsPerPageOptions={[9]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </div>
    </div>
  );
}
