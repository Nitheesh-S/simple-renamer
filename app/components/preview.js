import React, { useContext } from 'react'
import { ExplorerContext } from "../contexts/ExplorerContext";

function Preview(){
    const { previewList } = useContext(ExplorerContext);
	return(
        <div>
            <h4>Preview</h4>
            <ul>
                {previewList.map((el,i) => <li key={i}>{el}</li>)}
            </ul>
        </div>
    )
}
export default Preview;
