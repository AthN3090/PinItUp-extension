/* global chrome */
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react'
import FolderComponent from '../components/FolderComponent';
import uniqid from 'uniqid';
import './HomeView.css'
function HomeView({data}) {
    const [folderList, setFolderList] = useState()
    const navigate = useNavigate()
    function getFolders(){
        chrome.storage.local.get(null)
        .then((response)=>{
            setFolderList(response)
        })
    }
    useEffect(()=>{
        getFolders()
        chrome.storage.local.onChanged.addListener((response) =>{
            getFolders()
        })
    },[])
    function newFolder(folderName){
        const FolderKey = "Folder+" + uniqid()
        const tabObj = {
            name : "New folder", 
            tabs: []
        }
        chrome.storage.local.set({[FolderKey]: tabObj})
        .then((response)=>{
         navigate('/TabView', {state : {data: {...tabObj, key: FolderKey}}})
        })

    }
    return ( 
        <>
            <button className='newfolder-button' onClick={() => { newFolder("New Folder") }}>+ New folder</button>
            <div className='folder-container'>
                {folderList ? Object.keys(folderList).map((item) => {

                    return (<FolderComponent key={item} data={{ ...folderList[item], key: item }} />)

                })
                    : <div>Loading..</div>}
            </div> 

        </>
    );
}

export default HomeView;