import React, { Component } from 'react'

const defaultState = {
    dark: false,
    notFound: false,
    toggleDark: () => {}
}

const ThemeContext = React.createContext(defaultState)
const supportsDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches === true

class ThemeProvider extends Component {

    state = {
        dark:true,
        notFound: false,
    }

    toggleDark = () => {
        let dark = !this.state.dark
        localStorage.setItem('dark', JSON.stringify(dark))
        this.setState({ dark })
    }

    setNotFound = () => {
        this.setState({ notFound: true })
    }

    setFound = () => {
        this.setState( { notFound: false } )
    }

    componentDidMount() {
        const lsDark = JSON.parse(localStorage.getItem('dark'))
        if (lsDark) {
            this.setState({ dark: lsDark })
        }
    }

    render() {
        const { children } = this.props
        const { dark, notFound } = this.state
        console.log("Iskal Render")
        return(
            <ThemeContext.Provider
                value={{
                    dark,
                    notFound,
                    setFound: this.setFound,
                    setNotFound: this.setNotFound,
                    toggleDark: this.toggleDark,
                }}
            >
            {children}
            </ThemeContext.Provider>
        )
    }
}

export default ThemeContext

export { ThemeProvider }
