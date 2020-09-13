import React, { useState, useReducer, createContext, useEffect } from "react";

export const ExplorerContext = createContext();

const path = window.require('path');
const fs = window.require('fs');
const fsp = fs.promises;

const initialExplorerState = {
	currentPath: path.resolve(process.cwd()),
    currentDirList: [],
}

const explorerStateReducer = (explorerState, action) => {
    if(action.type == 'updateAll') {
        let newState = {...explorerState, ...action.payload}
        return newState;
    }
    if(action.type == 'updateDirList') {
        return {...explorerState, currentDirList: action.payload };
    }
    if(action.type == 'updateCurrentPath') {
        return {...explorerState, currentPath: action.payload };
    }
}

const ExplorerContextProvider = (props) => {
	const [selectionList, setSelectionList] = useState(new Set);
	const [explorerState, dispatchExplorerState] = useReducer(explorerStateReducer, initialExplorerState);
	const [example, setExample] = useState('');

	const processExample = (prosessNewName) => {
		let exampleList = selectionList.size ? [...selectionList] : [...explorerState.currentDirList];
		let newExample = exampleList.length ? prosessNewName(exampleList[0]) : 'Folder is Empty';
	
		setExample(newExample);
	}

	useEffect(() => {
		const setInitialDirList = async () => {
			let initialCurrentDirList = await fsp.readdir(explorerState.currentPath, { encoding: 'utf8' , flag: 'r' })
			dispatchExplorerState({type: 'updateDirList', payload: initialCurrentDirList})
		}
		setInitialDirList();
	},[])

	return (
		<ExplorerContext.Provider
			value={{
				selectionList, setSelectionList,
				explorerState, dispatchExplorerState,
				example, processExample
			}}
		>
			{props.children}
		</ExplorerContext.Provider>
	);
}

export default ExplorerContextProvider;