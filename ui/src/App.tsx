import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { get_status } from "./api/api";
import "./App.css";
import { generateUUID } from "./logic/uuid";
import Board from "./ui/Board";
import CreateGame from "./ui/CreateGame";
import FenInput from "./ui/FenInput";
import { Action, ActionType } from "./models/actions";
import GameSidebar from "./ui/GameSidebar";
import Game from "./ui/Game";
import { CLIENT_UUID_KEY } from "./models/constants";


function App() {

  const dispatch = useDispatch();


  useEffect(() => {
    get_status();
  });

  function Home() {
    return <>
      <Board/>
      <CreateGame/>
    </>
  }

  return (
    <div className="App">
      <div className="app-container">
        <Router>
          <Switch>
            <Route path="/game/:gameInstanceUUID">
              <Game/>
            </Route>
            <Route path="/">
              <Home></Home>
            </Route>
          </Switch>
        </Router>

      </div>
    </div>
  );
}

export default App;
