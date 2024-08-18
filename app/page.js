'use client'

import Image from "next/image";
import getStripe from "@/utils/get_stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DevicesIcon from '@mui/icons-material/Devices';
import Link from 'next/link';

export default function Home() {
  const theme = useTheme();

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            origin: 'http://localhost:3000'
        },
    });
    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.status === 500) {
        console.error(checkoutSession.message);
        return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id
    });

    if (error) {
        console.warn(error.message);
    }
  };

  return (
    <Container maxWidth="100vw">
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              color: '#ffffff',
              fontWeight: 'bold',
            }}
          >
            Flashcard Saas
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{
        textAlign: 'center',
        mt: 4,
        py: 6,
        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
        color: '#fff',
        borderRadius: 2,
      }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Welcome to Flashcard Saas</Typography>
        <Typography variant="h5" gutterBottom>
          Create flashcards and study them
        </Typography>

        {/* If user is signed in, show the buttons to generate or view flashcards */}
        <SignedIn>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#D7BDE2', // Set your desired color
                '&:hover': {
                  backgroundColor: '#F3E5F5', // Set the hover color
                }, 
                py: 1.5, 
                px: 4, 
                fontSize: '1.1rem' 
              }}>
              <Link href="/generate" passHref>
                Get Started
              </Link>
            </Button>

            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#D7BDE2', // Set your desired color
                '&:hover': {
                  backgroundColor: '#F3E5F5', // Set the hover color
                }, 
                py: 1.5, 
                px: 4, 
                fontSize: '1.1rem' 
              }}>
              <Link href="/flashcards" passHref>
                Saved Sets
              </Link>
            </Button>
          </Box>
        </SignedIn>

        {/* If user is signed out, show a prompt to sign in or sign up */}
        <SignedOut>
          <Typography variant="h6" sx={{ mt: 4, color: '#fff' }}>
            Please <Link href="/sign-in" style={{ color: '#fff', textDecoration: 'underline' }}>Login</Link> or <Link href="/sign-up" style={{ color: '#fff', textDecoration: 'underline' }}>Sign Up</Link> to get started.
          </Typography>
        </SignedOut>
      </Box>

      {/* Features Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>Features</Typography>
        <Grid container spacing={4} sx={{ textAlign: 'center' }}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 3,
              border: '1px solid #ddd',
              borderRadius: 2,
              backgroundColor: '#F3E5F5',  // Light blue background
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: '#D7BDE2',  // Slightly darker blue on hover
              }
            }}>
              <SchoolIcon sx={{ fontSize: 50, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Easy Text Input</Typography>
              <Typography variant="body1">
                Simply input your text and the app will generate flashcards for you. Creating Flashcards has never been easier.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 3,
              border: '1px solid #ddd',
              borderRadius: 2,
              backgroundColor: '#F3E5F5',  // Light green background
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: '#D7BDE2',  // Slightly darker green on hover
              }
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 50, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Smart Flashcards</Typography>
              <Typography variant="body1">
                Our AI intelligently generates flashcards based on the text you input, perfect for studying, revision, and more.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 3,
              border: '1px solid #ddd',
              borderRadius: 2,
              backgroundColor: '#F3E5F5',  // Light orange background
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: '#D7BDE2',  // Slightly darker orange on hover
              }
            }}>
              <DevicesIcon sx={{ fontSize: 50, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Accessible Anywhere</Typography>
              <Typography variant="body1">
                Access your flashcards anywhere, anytime. Our app is accessible on any device, so you can study on the go.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Typography variant="h5" gutterBottom>
          Choose a plan that works for you
        </Typography>

        <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
            <Box sx={{
              p: 2.8,
              border: '2px solid',  // Thicker border to match the Pro box
              borderColor: 'primary.main',  // Highlighted border color
              borderRadius: 2,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',  // Same shadow as Pro box
              backgroundColor: '#e3f2fd',  // Slightly different background to indicate selection
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>Basic</Typography>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>FREE</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Access to basic flashcards features and limited storage.
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold', mt: 2, textAlign: 'center' }}>
                Chosen by Default
              </Typography>

              <Button 
                variant="contained" 
                sx={{ 
                  mt: 2, 
                  py: 1.5, 
                  px: 4, 
                  backgroundColor: 'primary.main', 
                  color: '#fff', 
                  cursor: 'default',
                  '&:hover': {
                    backgroundColor: 'primary.dark',  // Darken on hover for effect, though cursor is default
                  } 
                }}
                disabled  // Disable the button since it's selected by default
              >
                Chosen
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 4,
              border: '2px solid',
              borderColor: theme.palette.secondary.main,
              borderRadius: 2,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              background: 'linear-gradient(135deg, #f39c12, #f1c40f)',  // Gradient background for premium feel
              color: '#fff',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                Pro
              </Typography>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                $10/month
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                - Unlimited flashcards, storage, with priority support.
              </Typography>

              <Button 
                variant="contained" 
                color="secondary" 
                sx={{ 
                  mt: 2, 
                  py: 1.5, 
                  px: 4, 
                  backgroundColor: '#e67e22', 
                  '&:hover': { 
                    backgroundColor: '#d35400' 
                  } 
                }} 
                onClick={handleSubmit}
              >
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 4 }}>
          Need help deciding? <a href="/contact" style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>Contact us</a> for more information.
        </Typography>
      </Box>
    </Container>
  );
}