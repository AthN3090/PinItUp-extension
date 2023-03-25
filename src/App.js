import './App.css';
import HomeView from './Views/HomeView';
import TabView from './Views/TabView';
import { Routes, Route } from 'react-router-dom';
import logo from "./images/icon32.png"
function App() {

  return (
    <div className="App">
      <nav className='banner'>
        <img className='banner-image' height={"24px"} width={"24px"} src={logo} alt="banner-logo"/>
        <span className='banner-name'>PinItUp</span>
      </nav>
      <Routes>
        <Route path="/" index element={<HomeView />}></Route>
        <Route path="/TabView" element={<TabView/>}></Route>
      </Routes>
      

    </div>
  );
}

export default App;
