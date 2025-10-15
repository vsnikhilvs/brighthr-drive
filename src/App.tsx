import { Box } from '@mui/material'
import { DocumentViewer } from './components/DocumentViewer'
import { ROOT_ITEMS } from './data'

function App() {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <DocumentViewer rootItems={ROOT_ITEMS} />
    </Box>
  )
}

export default App
