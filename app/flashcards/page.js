'use client'

import { useUser } from '@clerk/nextjs'
import { Container, Typography, Box, Grid, Card, CardActionArea, CardContent, Button } from '@mui/material'
import { doc, getDoc, setDoc, collection } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { db } from '@/firebase'

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, { flashcards: [] })
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 6, position: 'relative', zIndex: 1, pb: 4 }}>
            {/* Background Design */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                    zIndex: -1,
                    opacity: 0.85,
                    borderRadius: 3,
                }}
            />

            <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', mb: 5 }}>
                Your Flashcard Collections
            </Typography>

            <Grid container spacing={3}>
                {flashcards.length > 0 ? (
                    flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                                background: '#8e44ad', // Single color for cards
                                borderRadius: '8px', // Slightly rounded corners
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    backgroundColor: '#9b59b6',
                                },
                                overflow: 'hidden',
                                height: '120px', // Reduced height for smaller rectangular shape
                                display: 'flex', // Ensure content is centered
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <CardActionArea onClick={() => { handleCardClick(flashcard.name) }}>
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h6" component="div" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                            {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" sx={{ color: '#ffffff', textAlign: 'center', mt: 4, width: '100%' }}>
                        No flashcard collections found. Start creating your first set!
                    </Typography>
                )}
            </Grid>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <Button 
                    variant='contained' 
                    href="/" 
                    sx={{ fontSize: '1rem', backgroundColor: '#ffffff', color: '#6a11cb', '&:hover': { backgroundColor: '#f8f9fa' } }}
                >
                    Back to Home
                </Button>
            </Box>
        </Container>
    )
}