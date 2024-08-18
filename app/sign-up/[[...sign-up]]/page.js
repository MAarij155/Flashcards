import { Box, Button, Typography, Container, AppBar, Toolbar, Link } from "@mui/material";
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" sx={{ backgroundColor: "#6a11cb" }}> {/* Updated color to match theme */}
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }} color="white">
            Flashcard Saas
          </Typography>
          <Button color="inherit">
            <Link href="/sign-in" passHref underline="none" sx={{ color: 'white', fontWeight: 'bold' }}>
              Sign In
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" passHref underline="none" sx={{ color: 'white', fontWeight: 'bold' }}>
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to right, #6a11cb, #2575fc)', // Gradient background
          padding: 4,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 4 }}>
          Sign Up
        </Typography>
        <Box sx={{ backgroundColor: '#ffffff', borderRadius: 2, p: 4, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}>
          <SignUp />
        </Box>
      </Box>
    </Box>
  );
}