/* global chrome */
import { tab } from '@testing-library/user-event/dist/tab';
import { useCallback, useEffect, useRef, useState } from 'react';
import {Link, useFetcher, useLocation} from 'react-router-dom'
import backIcon from "../Images/left32.png"
import dotIcon from "../Images/dots32.png"
import deleteIcon from "../Images/delete32.png"
import './TabView.css';
function TabView() {
    const location = useLocation()
    const [tabsArray, setTabsArray] = useState(location.state.data.tabs || [])
    let folderName = location.state.data.name
    let folderKey = location.state.data.key
    const [folderNameState, setFolderNameState] = useState(folderName)
    const tabsMount = useRef(false)    
    
    function folderNameChange(e){
        setFolderNameState(e.target.value)
        const tabObj = {
            name: e.target.value,
            tabs: [...tabsArray]
        }
        folderName = e.target.value
        chrome.storage.local.set({[folderKey]: tabObj})
        
        
    }
    function addCurrentPage(){
        chrome.tabs.query({active: true, currentWindow: true})
        .then((result)=>{

            if(!tabsArray.filter((item) => result[0].title === Object.keys(item)[0]).length){
                let newTabs = [...tabsArray, { [result[0].title]: [result[0].url, result[0].favIconUrl], }]
                chrome.storage.local.set({ [folderKey]: { name: folderNameState, tabs: [...newTabs] } })
                    .then(() => {
                        setTabsArray(newTabs)
                    })
            }
            
            
        }
        
        )
    }

    function deleteTab(name){
        const newtabsArray = tabsArray.filter((item, index) => name !== Object.keys(item)[0])
        chrome.storage.local.set({[folderKey]: {name:folderNameState, tabs: [...newtabsArray]}})
        .then(()=>{
            if(newtabsArray.length === 0) tabsMount.current = false
            setTabsArray(newtabsArray)
        })
    }
    
    function openNewTab(url){
        chrome.tabs.create({active: true, url})

    }
    function addAllTabs(){
        chrome.tabs.query({currentWindow: true})
        .then((result)=> {
            const newtabsArray = [...tabsArray, ...result.map(item => {
                return {[item.title] : [item.url, item.favIconUrl]}
            })]
            let filteredNewtabsArray = [];
            newtabsArray.filter(function (item) {
                var i = filteredNewtabsArray.findIndex(x => (Object.keys(x)[0] === Object.keys(item)[0] && Object.values(x)[0][0] === Object.values(item)[0][0] && Object.values(x)[0][1] === Object.values(item)[0][1]));
                if (i <= -1) {
                    filteredNewtabsArray.push(item);
                }
                return null;
            });
            chrome.storage.local.set({[folderKey]: {name:folderNameState, tabs: [...filteredNewtabsArray]}})
            .then(()=>{
                setTabsArray(filteredNewtabsArray)
            })
        })
    }

    function openAllTabs(){
        tabsArray.forEach((item) => {
            const url = Object.values(item)[0][0]
            openNewTab(url)
        })
    }

    function addSelectedTabs(){
        chrome.tabs.query({highlighted: true, currentWindow: true})
        .then((result)=> {
            
            const newtabsArray = [...tabsArray, ...result.map(item => {
                return {[item.title] : [item.url, item.favIconUrl]}
            })]
            let filteredNewtabsArray = [];
            newtabsArray.filter(function (item) {
                var i = filteredNewtabsArray.findIndex(x => (Object.keys(x)[0] === Object.keys(item)[0] && Object.values(x)[0][0] === Object.values(item)[0][0] && Object.values(x)[0][1] === Object.values(item)[0][1]));
                if (i <= -1) {
                    filteredNewtabsArray.push(item);
                }
                return null;
            });
            chrome.storage.local.set({[folderKey]: {name:folderNameState, tabs: [...filteredNewtabsArray]}})
            .then(()=>{
                setTabsArray(filteredNewtabsArray)
                
            })
        })
    }

    function scrollLastTabInView(){
        document.querySelector('.tab-container:last-child').scrollIntoView({behavior: "smooth"})
    }

    const outsideClickEvent = (e) => {
        const menu = document.getElementById('popup-menu')
        if(menu){
            menu.style.display = 'none'
        } 

    }
    function showMenu(e){
        e.stopPropagation();
        const menu = document.getElementById('popup-menu')
        const body = document.getElementsByTagName('body')[0]
        if(menu.style.display === 'block'){
            menu.style.display = 'none'
            body.removeEventListener('click', outsideClickEvent)
        }else{
            menu.style.display = 'block'
            body.addEventListener('click', outsideClickEvent)
        } 
        
    }
    useEffect(()=>{
        
        if(folderName === "New folder"){
            const input = document.getElementById('foldername-input')
            input.select()
            input.focus()
        }
            

        
    },[folderName])

    useEffect(()=>{
        if(tabsMount.current){
            scrollLastTabInView()
        }else{
            tabsMount.current = true
        }
    },[tabsArray])


    return ( 
    <> 
    <nav className='tabview-navbar'>
        <div style={{display:"flex", alignItems:"center"}}>
            <Link to="/" className='back-btn'><img src={backIcon} height={"28px"} width={"28px"}  alt="back-icon" /></Link>
            <input id="foldername-input" className="folderName-input" type={"text"} value={folderNameState} onChange={folderNameChange}/>
        </div>
        <button onClick={(e) => {showMenu(e)}} className="popup-menu-btn" id='popup-menu-btn'><img src={dotIcon} height="22px" width="22px" className='menu-icon' alt="tab-favicon"/></button>
        <div id="popup-menu" className='popup-menu'>
            <button onClick={openAllTabs}>Open all</button>
            <button onClick={addAllTabs}>Add all tabs</button>
            <button onClick={addSelectedTabs}>Add selected tabs</button>
        </div>
    </nav>
        <button className="add-current-tab-btn" onClick={addCurrentPage}>+ Add current page</button>
        <div className='all-tab-container'>
            {tabsArray.map((item, index) => {
                const tabName = Object.keys(item)[0]
                const {hostname} = new URL(item[tabName]);
                return (
                    <div className='tab-container'>
                    <div key={index} className='tab-card' onClick={()=> {openNewTab(item[tabName][0])}}>
                    <img src={item[tabName][1]} height="32px" width="32px" className='tab-favicon' alt="tab-favicon"/>
                        <div className='tab-card-content'>
                            <p >{tabName}</p>
                            <p>{hostname}</p>
                        </div>
                        
                    </div>
                    <button className="tabdelete-button" onClick={()=> {deleteTab(tabName)}}><img height={"22"} width={"22"} src={deleteIcon} alt="delete-button"/></button>
                    </div>
                    
                    )
            })}
        </div>
        
        
        
    </> 
    );
}

export default TabView;