import React, { useContext, useState, useEffect } from 'react';
import { ExplorerContext } from "../contexts/ExplorerContext";
import { createPortal } from 'react-dom';

const fs = window.require('fs');
const path = window.require('path');

function Rules(){
    const [renameType, setRenameType] = useState('replace_text');
    

    const RenameForm = () => {
        if(renameType == 'replace_text') return <ReplaceText/>
        if(renameType == 'add_text') return <AddText/>
        if(renameType == 'format_text') return <FormatText/>
    }

	return(
        <div className='rules-block'>
            <select name="rename_type" onChange={e => setRenameType(e.target.value)}>
                <option value="replace_text">Replace Text</option>
                <option value="add_text">Add Text</option>
                <option value="format_text">Format Text</option>
            </select>
            <RenameForm />
        </div>
    )
}

const getExtension = name => name.includes('.') ? name.slice(name.indexOf('.')) : '';

const getFileProps = fullName => {
    if(!fullName.includes('.')) return { fileName: fullName, extension: '' }

    let extension = fullName.slice(fullName.indexOf('.'))
    return {
        fileName: fullName.slice(0, -1 * extension.length),
        extension
    }
};

const ReplaceText = () => {
    const { selectionList, explorerState, dispatchExplorerState, example, processExample } = useContext(ExplorerContext);
    const [findValue, setFind] = useState('');
    const [replaceValue, setReplace] = useState('');

    const prosessNewName = (name) => {
        let { fileName, extension } = getFileProps(name);
        
        return fileName.replace(findValue, replaceValue) + extension;
    }

    useEffect(() => {
        processExample(prosessNewName)
    },[])

    useEffect(() => {
        processExample(prosessNewName)
    },[findValue, replaceValue, explorerState.currentDirList])
    
    const handleSubmit = () => {
        let currentDirList = [...explorerState.currentDirList];
        let hasSelection = !!selectionList.size;

        currentDirList = currentDirList.map(name => {
            if(hasSelection && !selectionList.has(name)) return name;
            
            let currentPath = explorerState.currentPath;
            let newName = prosessNewName(name);

            try {
                fs.renameSync(currentPath + name, currentPath + newName)
            } catch (error) {
                console.error(error);
                newName = name;
            } finally {
                return newName;
            }
        })

        dispatchExplorerState({type: 'updateDirList', payload: currentDirList})
    }

    return (
        <>
            <div className='replace-text'>
                <label className="input-group">
                    Find:
                    <input type="text" onChange={e => setFind(e.target.value)}/>
                </label>
                <label className="input-group">
                    Replace With:
                    <input type="text" onChange={e => setReplace(e.target.value)}/>
                </label>
            </div>
            <button onClick={e => handleSubmit()}>RENAME</button>
            <p>{example}</p>
        </>
    )
}

const AddText = () => {
    const { selectionList, explorerState, dispatchExplorerState, example, processExample } = useContext(ExplorerContext);
    const [addText, setAddText] = useState('');
    const [where, setWhere] = useState('before_name');

    const prosessNewName = (name = '') => {
        // if(typeof(addText) !== "string") addText = ""

        let { fileName, extension } = getFileProps(name);

        return where == 'before_name' ? addText + name : fileName + addText + extension;
    }
    
    useEffect(() => {
        processExample(prosessNewName)
    },[])

    useEffect(() => {
        processExample(prosessNewName)
    },[addText, where, explorerState.currentDirList])
    
    const handleSubmit = () => {
        let currentDirList = [...explorerState.currentDirList];
        let hasSelection = !!selectionList.size;

        currentDirList = currentDirList.map(name => {
            if(hasSelection && !selectionList.has(name)) return name;
            
            let currentPath = explorerState.currentPath;
            let newName = prosessNewName(name);

            try {
                fs.renameSync(currentPath + name, currentPath + newName)
            } catch (error) {
                console.error(error);
                newName = name;
            } finally {
                return newName;
            }
        })
      dispatchExplorerState({type: 'updateDirList', payload: currentDirList})
    }

    return (
        <>
            <div className='add-text'>
                <input type="text" onChange={e => setAddText(e.target.value)}/>
                <select name="where" onChange={e => setWhere(e.target.value)}>
                    <option value="before_name">Before Name</option>
                    <option value="after_name">After Name</option>
                </select>
            </div>
            <button onClick={e => handleSubmit()}>RENAME</button>
            <p>{example}</p>
        </>
    )
}

const FormatText = () => {
    const { selectionList, explorerState, dispatchExplorerState, example, processExample } = useContext(ExplorerContext);
    const [customFormat, setCustomFormat] = useState('');
    const [nameFormat, setNameFormat] = useState('name_and_index');
    const [where, setWhere] = useState('before_name');
    const [startPosition, setStartPosition] = useState(1);

    const prosessNewName = (name, index = 0) => {
        let textToAdd = '';
        if(nameFormat == 'name_and_date') {
            let now = new Date();
            textToAdd = `${now.getFullYear()}-${now.getMonth().toString().padStart(2,0)}-${now.getDate()} at ${now.toLocaleTimeString().replace(/:/g,'-')} - ${index}`
        }else{
            index += startPosition;
            textToAdd = index.toString();
    
            if(nameFormat == 'name_and_counter') textToAdd = textToAdd.padStart(5,0);
        }

        return (where == 'before_name' ? customFormat + textToAdd : textToAdd + customFormat) + getExtension(name);
    }
    
    useEffect(() => {
        processExample(prosessNewName)
    },[])

    useEffect(() => {
        processExample(prosessNewName)
    },[customFormat, nameFormat, where, startPosition, explorerState.currentDirList])
    
    const handleSubmit = () => {
        let currentDirList = [...explorerState.currentDirList];
        let hasSelection = !!selectionList.size;

        currentDirList = currentDirList.map((name, index) => {
            if(hasSelection) {
                if(!selectionList.has(name)) return name;

                index = [...selectionList].indexOf(name);
            }
            let currentPath = explorerState.currentPath;
            let newName = prosessNewName(name, index);

            try {
                fs.renameSync(currentPath + name, currentPath + newName)
            } catch (error) {
                console.error(error);
                newName = name;
            } finally {
                return newName;
            }
        })

        dispatchExplorerState({type: 'updateDirList', payload: currentDirList})
    }

    return (
        <>
            <div className='format-text'>
                <label htmlFor="name-format">Name Format:</label>
                <select id="name-format" name="name-format" onChange={e => setNameFormat(e.target.value)}>
                    <option value="name_and_index">Name and Index</option>
                    <option value="name_and_counter">Name and Counter</option>
                    <option value="name_and_date">Name and Date</option>
                </select>
                <label htmlFor="where">Where:</label>
                <select id="format-text-where" name="where" onChange={e => setWhere(e.target.value)}>
                    <option value="before_name">Before Name</option>
                    <option value="after_name">After Name</option>
                </select>
                <label htmlFor="custom-format">Custom Format:</label>
                <input id="custom-format" type="text" onChange={e => setCustomFormat(e.target.value)}/>
                <label htmlFor="start-numbers-at">Start Numbers at:</label>
                <input id="start-numbers-at" type="tel" onChange={e => setStartPosition(parseInt(e.target.value))}/>
            </div>
            <button onClick={e => handleSubmit()}>RENAME</button>
            <p>{example}</p>
        </>
    )
}

export default Rules;
