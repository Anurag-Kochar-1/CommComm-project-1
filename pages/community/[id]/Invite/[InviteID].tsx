import { useRouter } from 'next/router'
import React from 'react'

const InviteID = () => {
    const router = useRouter()
    const { InviteID } = router.query

    const joinCommunity = async () => {
        console.log(`first`)
    }

    return (
        <main>

            <p> You have been invited to {InviteID} </p>
            <button type='button' title='join' onClick={joinCommunity}> Join </button>
        </main>
    )
}

export default InviteID