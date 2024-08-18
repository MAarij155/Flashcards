'use client'

import { useUser } from '@clerk/nextjs'
import { Container, Typography, Box, Grid, Card, CardActionArea, CardContent, Button } from '@mui/material'
import { getDocs, collection, doc } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { db } from '@/firebase'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const [setName, setSetName] = useState('') // New state for the set name

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })

            setFlashcards(flashcards)
            setSetName(search) // Set the name of the flashcard set
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 6, position: 'relative', zIndex: 1, pb: 4 }}>
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

            <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
                {setName} Flashcards
            </Typography>

            <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center', mb: 5 }}>
                Click on a card to flip it and see the answer
            </Typography>

            <Grid container spacing={3}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                transition: 'transform 0.6s ease-in-out',
                                transformStyle: 'preserve-3d',
                                background: flipped[index] ? '#9b59b6' : '#8e44ad',
                                borderRadius: '12px',
                                height: '200px',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            }}
                            onClick={() => handleCardClick(index)}
                        >
                            <CardActionArea>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backfaceVisibility: 'hidden' }}>
                                    <Typography variant="h5" component="div" sx={{ color: '#ffffff' }}>
                                        {flipped[index] ? flashcard.back : flashcard.front}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant='contained'
                    href="/flashcards"
                    sx={{ fontSize: '1rem', backgroundColor: '#ffffff', color: '#6a11cb', '&:hover': { backgroundColor: '#f8f9fa' } }}
                >
                    Back to Flashcard Collections
                </Button>
            </Box>
        </Container>
    )
}