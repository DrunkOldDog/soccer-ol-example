import React, { useState } from 'react';
import Navbar from './components/Shared/Navbar/Navbar';
import './app.scss';
import { Grid } from '@material-ui/core';
import { Field } from './components/Field/Field';
import Table from './components/Table/Table';

function App() {
  const [play, setPlay] = useState(false);

  return (
    <div className="app">
      <Navbar />
      
      <Grid container className="grid-container">
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <Field 
            play={play}
            setPlay={setPlay}
          />
        </Grid>

        <Grid item lg={4} md={4} sm={12} xs={12} className="players-section">
          <div className="table-section">
            <Table />
          </div>

          <div className="action-btn">
            <h2>Who's gonna win?</h2>
            <button onClick={() => setPlay(true)}>Let's find out!</button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
