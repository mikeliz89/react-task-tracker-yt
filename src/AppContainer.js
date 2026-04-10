import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContainer() {

    return (
        <ThemeProvider>
            <App />
        </ThemeProvider>
    )
}

export default AppContainer


