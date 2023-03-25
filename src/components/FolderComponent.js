/* global chrome */
import {Link} from 'react-router-dom'
import folderIcon from "../Images/folder32.png"
import deleteIcon from "../Images/delete32.png"
import './FolderComponent.css'
function FolderComponent({data}) {
    const folderTitle = data.name
    function deleteFolder(key){
        chrome.storage.local.remove(key)
    }
    return (
        <div className='folder-component'>
            <Link className="folder-card" to="/TabView" state= {{ data }} >
            <img  height={"28"} width={"28"} src={folderIcon} alt="fodler-icon"/>
            <div className='folder-content-container'>
                <p>{folderTitle}</p>
                <p>{data.tabs.length? data.tabs.length: "0" } items</p>
            </div>

        </Link>
        <button className='delete-button' onClick={(e)=>{deleteFolder(data.key)} }><img height={"22"} width={"22"} src={deleteIcon} alt="delete-button"/></button>

        </div>
        
        
    );
}

export default FolderComponent;