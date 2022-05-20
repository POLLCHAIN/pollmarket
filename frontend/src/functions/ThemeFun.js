import React, { useState } from 'react'

const ThemeFun = () => {
    const [darkTheme, setDarkTheme] = useState(false)

    const toggleDarkTheme = (e) => {
        setDarkTheme(e)
    }

    return { toggleDarkTheme, darkTheme }
}

export default ThemeFun
