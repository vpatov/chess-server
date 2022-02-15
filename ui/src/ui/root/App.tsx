import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { get_status } from "../../api/api";
import "./App.css";
import Board from "../board/Board";
import CreateGame from "../sidebar/createGame/CreateGame";
import Game from "../game/Game";
import Sidebar, { SidebarMode } from "../sidebar/Sidebar";
import {
  ThemeProvider,
  createTheme,
} from "@material-ui/core/styles";
const theme = createTheme();



function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    get_status();
  });


  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className="app-container">
          <Router>
            <Switch>
              <Route path="/game/:gameInstanceUUID">
                <Game sidebarMode={SidebarMode.GAME_SIDEBAR} />
              </Route>
              <Route path="/">
                <Game sidebarMode={SidebarMode.CREATE_GAME} />
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
