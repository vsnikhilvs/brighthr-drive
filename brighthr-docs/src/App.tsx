import { Paper } from '@mui/material'
import { DocumentViewer } from './components/DocumentViewer'
import { ROOT_ITEMS } from './data'

function App() {
  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        minHeight: '100vh',
        minWidth: '100vw',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <DocumentViewer rootItems={ROOT_ITEMS} />
    </Paper>
  )
}

export default App
