'use client'

import { useUser } from '@clerk/nextjs'
import { Container, Typography, Box, CircularProgress, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return

            try {
                const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
                const sessionData = await res.json()
                if (res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error)
                }
            } catch (err) {
                setError("Something went wrong, try again later")
            } finally {
                setLoading(false)
            }
        }

        fetchCheckoutSession()
    }, [session_id])

    if (loading) {
        return (
            <Container maxWidth='100vw' sx={{
                textAlign: 'center',
                mt: 4,
            }}>
                <CircularProgress />
                <Typography variant='h6'>
                    Loading...
                </Typography>
            </Container>
        )
    }

    if (error) {
        return (
            <Container maxWidth='100vw' sx={{
                textAlign: 'center',
                mt: 4,
            }}>
                <Typography variant='h6'>
                    {error}
                </Typography>
                <Button 
                    variant="contained" 
                    sx={{ mt: 3, backgroundColor: '#6a11cb', color: '#fff', '&:hover': { backgroundColor: '#2575fc' } }}
                    onClick={() => router.push('/')}
                >
                    Back to Home
                </Button>
            </Container>
        )
    }

    return (
        <Container maxWidth='100vw' sx={{
            textAlign: 'center',
            mt: 4,
        }}>
            {
                session.payment_status === 'paid' ? (
                    <>
                        <Typography variant='h4'>Thanks for your payment!</Typography>
                        <Box sx={{ mt: 22 }}>
                            <Typography variant='h6'>Session ID: {session_id}</Typography>
                            <Typography variant='body1'>We have received your payment. You will receive an email shortly.</Typography>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant='h4'>Payment Failed</Typography>
                        <Box sx={{ mt: 22 }}>
                            <Typography variant='body1'>Payment was not successful, please try again.</Typography>
                        </Box>
                    </>
                )
            }
            <Button 
                variant="contained" 
                sx={{ mt: 4, backgroundColor: '#6a11cb', color: '#fff', '&:hover': { backgroundColor: '#2575fc' } }}
                onClick={() => router.push('/')}
            >
                Back to Home
            </Button>
        </Container>
    )
}

export default ResultPage