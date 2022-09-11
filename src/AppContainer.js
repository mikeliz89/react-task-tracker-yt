import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';

function AppContainer() {

    return (
        <ThemeProvider>
            <App />
        </ThemeProvider>
    )
}

export default AppContainer