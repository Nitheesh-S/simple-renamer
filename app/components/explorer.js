import React, { useEffect, useRef, useContext } from 'react';

import { ExplorerContext } from "../contexts/ExplorerContext";

// import cx from "classnames";

const fs = window.require('fs');
const fsp = fs.promises;
const electron = window.require('electron');


const getPreviousDir = path => path.replace(/[^\\]+\\?$/,'');

const isDirectory = path => {
    try {
        return fs.lstatSync(path).isDirectory();
    } catch (err) {}
    return false;
}

let selectionStart = '';

function Explorer(){
    const { selectionList, setSelectionList, explorerState, dispatchExplorerState } = useContext(ExplorerContext);
    const pathInputEl = useRef(null);

    useEffect(() => {
        const updateDirList = async () => {
            let currentDirList = [];
            if(isDirectory(explorerState.currentPath)){
                currentDirList = await fsp.readdir(explorerState.currentPath, { encoding: 'utf8' , flag: 'r' });
                pathInputEl.current.value = explorerState.currentPath;
                dispatchExplorerState({type: 'updateDirList', payload: currentDirList})
            }
        }
        updateDirList()
    },[])

    async function handleEvent(path) {
        if(path === '..') path = getPreviousDir(explorerState.currentPath)
        let newState = {};
        if(isDirectory(path)){
            pathInputEl.current.value = path;
            newState.currentPath = path;
            newState.currentDirList = await fsp.readdir(path, { encoding: 'utf8' , flag: 'r' });
            setSelectionList(new Set);

            dispatchExplorerState({type: 'updateAll', payload: newState})
        }
    }

    function handleSelection(e,el){        
        let shiftSelectionList = [];
        
        if(!e.shiftKey) selectionStart = el;

        if(e.shiftKey){
            if(!selectionStart) selectionStart = explorerState.currentDirList[0];

            let startIndex = explorerState.currentDirList.indexOf(selectionStart);
            let endIndex = explorerState.currentDirList.indexOf(el);

            let sliceParams = startIndex > endIndex ? [endIndex, startIndex + 1] : [startIndex, endIndex + 1];

            shiftSelectionList = explorerState.currentDirList.slice(...sliceParams);
        }
        
        let newSelectionList = [];

        if(e.ctrlKey) 
            newSelectionList = [...selectionList, ...shiftSelectionList, el]
        else if(e.shiftKey)
            newSelectionList = [...shiftSelectionList]
        else
            newSelectionList = [el]
        
        setSelectionList(new Set(newSelectionList))
    }

    const handleOpenFolder = async () => {
        
        // let openFolderWindow = new electron.remote.BrowserWindow({width: 800, height: 600});

        let options = {
            // See place holder 1 in above image
            title : "Custom title bar", 
            
            // // See place holder 2 in above image
            // defaultPath : "D:\\electron-app",
            
            // // See place holder 3 in above image
            // buttonLabel : "Custom button",
            
            // // See place holder 4 in above image
            // filters :[
            //  {name: 'Images', extensions: ['jpg', 'png', 'gif']},
            //  {name: 'Movies', extensions: ['mkv', 'avi', 'mp4']},
            //  {name: 'Custom File Type', extensions: ['as']},
            //  {name: 'All Files', extensions: ['*']}
            // ],
            properties: ['openDirectory']
        }
        
        try {
            let result = await electron.remote.dialog.showOpenDialog(options)
            console.log('result :', result)
            console.log('result.filePaths :', result.filePaths)            
        } catch (error) {
            console.log(error)
        }    
        // electron.remote.dialog.showOpenDialog(options, (dir) => {
        //     console.log('dir -->', dir)
        // })

    }

    return(
        <div className="explorer-block">
            <input type="text" ref={pathInputEl} onChange={e => handleEvent(e.target.value)} />
            <button onClick={handleOpenFolder}>Open Folder</button>
            <ul>
                <li><button onDoubleClick={e => handleEvent('..')}>..</button></li>
                {explorerState.currentDirList.map((el, i) => {
                    if(isDirectory(`${explorerState.currentPath}${el}\\`))
                        return (
                            <li key={i}>
                                <button 
                                    onClick={e => handleSelection(e,el)} 
                                    onDoubleClick={e => handleEvent(`${explorerState.currentPath}${el}\\`)} 
                                    className={[...selectionList].includes(el) ? 'folder is-selected' : 'folder'}
                                >
                                    {el}
                                </button>
                            </li>
                        )
                    else{
                        return (
                            <li key={i}>
                                <button 
                                    onClick={e => handleSelection(e,el)} 
                                    className={[...selectionList].includes(el) ? 'file is-selected' : 'file'}
                                >
                                    {el}
                                </button>
                            </li>
                        )
                    }
                })}
            </ul>
        </div>
    )
}

export default Explorer;