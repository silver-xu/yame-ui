import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette: {
        primary: {
            light: '#90caf9',
            main: '#2196f3',
            dark: '#1565c0',
            contrastText: '#fff'
        }
    }
});

export default theme;
