import React, {  } from 'react'
import ReactDOM from 'react-dom'
import './index.scss'

import ExplorerContextProvider from "./contexts/ExplorerContext";
import ExplorerBlock from "./components/explorer";
import Rules from "./components/rules";
import Preview from "./components/preview";

function App() {
    return (
        <ExplorerContextProvider>
            <div className='app-home'>
                <div className='header'>
                    <Rules/>
                </div>
                <div className='ls-container'>
                    <ExplorerBlock/>
                </div>
            </div>
        </ExplorerContextProvider>
    );
}

ReactDOM.render(<App />, document.getElementById('app'))