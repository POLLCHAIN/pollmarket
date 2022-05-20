import { useState } from 'react'

const DrawerControlerFun = () => {
    
    const [show, setShow] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [key, setKey] = useState("1")

    const changeDrawer = () => {
        setShow(!show)
    }

    const changeTab = (key) => {
        setActiveTab(key)
    }

    const changeKey = (key) => {
        setKey(key)
    }

    return {show, changeDrawer, activeTab, changeTab, changeKey, key};
}

export default DrawerControlerFun;
