'use client'

import { useUser } from '@clerk/nextjs'
import { Container, Typography, Box, TextField, Button, Paper, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, CircularProgress } from '@mui/material'
import { writeBatch, doc, getDoc, collection } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { db } from '@/firebase'

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([]) 
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('') 
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)  // Loading state
    const router = useRouter()

    const handleSubmit = async () => {
        setLoading(true)  // Start loading
        fetch('/api/generate', {
            method: 'POST',
            body: text,
        })
        .then((res) => res.json())
        .then(data => {
            const mappedFlashcards = data.map(flashcard => ({
                front: flashcard.question,  // Adjust according to actual data keys
                back: flashcard.answer      // Adjust according to actual data keys
            }));
            setFlashcards(mappedFlashcards);
            setLoading(false)  // Stop loading
        })
        .catch(() => {
            setLoading(false)  // Stop loading on error
        });
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const resetGeneration = () => {
        setFlashcards([]);
        setText('');
        setFlipped([]);
    }

    return (
        <Container maxWidth="md">
            <Box sx={{
                mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#8e44ad', fontWeight: 'bold' }}>
                    Generate Flashcards
                </Typography>
                <Paper sx={{ p: 4, width: "100%", backgroundColor: '#e3f2fd', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: 2 }}>
                    <TextField 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        label="Enter text to generate flashcards"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 1 }}
                    />

                    <Button 
                        variant='contained' 
                        color='primary' 
                        onClick={handleSubmit} 
                        fullWidth
                        sx={{ py: 1.5, fontSize: '1rem', backgroundColor: '#8e44ad', '&:hover': { backgroundColor: '#9b59b6' } }}
                    >
                        Submit
                    </Button>
                    <Button 
                        variant='outlined' 
                        onClick={resetGeneration} 
                        fullWidth
                        sx={{ mt: 2, py: 1.5, fontSize: '1rem', color: '#8e44ad', borderColor: '#8e44ad', '&:hover': { borderColor: '#9b59b6', color: '#9b59b6' } }}
                    >
                        Reset
                    </Button>
                </Paper>
                <Button 
                    variant='outlined' 
                    href="/" 
                    sx={{ mt: 2, fontSize: '1rem', borderColor: '#8e44ad', color: '#8e44ad', '&:hover': { borderColor: '#9b59b6', color: '#9b59b6' } }}
                >
                    Back to Home
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress sx={{ color: '#8e44ad' }} />
                    <Typography variant="h6" sx={{ ml: 2 }}>Generating flashcards...</Typography>
                </Box>
            ) : (
                flashcards.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant='h5' sx={{ mb: 2, textAlign: 'center', color: '#8e44ad' }}>Flashcard Preview</Typography>
                        <Grid container spacing={3}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card sx={{ 
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                                        transition: 'transform 0.3s ease',
                                        backgroundColor: '#d7bde2',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            backgroundColor: '#e8daef'
                                        }
                                    }}>
                                        <CardActionArea onClick={() => { handleCardClick(index) }}>
                                            <CardContent>
                                                <Box sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        position: 'relative',
                                                        transformStyle: 'preserve-3d',
                                                        transition: 'transform 0.8s',
                                                        width: '100%',
                                                        height: '200px',
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box',
                                                        backgroundColor: '#f3f3f3',
                                                        borderRadius: 1,
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)',
                                                    },
                                                }}>
                                                    <div>
                                                        <div>
                                                            <Typography variant="h5" component="div" sx={{ textAlign: 'center', color: '#8e44ad' }}>
                                                                {flashcard.front}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography variant="h5" component="div" sx={{ textAlign: 'center', color: '#8e44ad' }}>
                                                                {flashcard.back}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Button 
                                variant='contained' 
                                color='secondary' 
                                onClick={handleOpen} 
                                sx={{ py: 1.5, px: 4, backgroundColor: '#9b59b6', '&:hover': { backgroundColor: '#8e44ad' } }}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                )
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcard collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin='dense'
                        type='text'
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant='outlined'
                        label='Collection Name'
                        sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#8e44ad' }}>Cancel</Button>
                    <Button onClick={setFlashcards} sx={{ color: '#8e44ad' }}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}