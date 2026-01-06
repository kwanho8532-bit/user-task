import api from '../../../api/axios'
import { useState, useEffect } from 'react'
import SignFormContainer from '../shared/SignFormContainer';
// import { useMemo } from 'react'

export default function SignUpApp() {
    // const [users, setUsers] = useState([])

    // useEffect(() => {
    //     async function getUsers() {
    //         const res = await api.get('/users')
    //         console.log(res.data)
    //         setUsers(res.data)
    //     }
    //     getUsers()
    // }, [])

    return (
        <div>
            <SignFormContainer label='Sign Up' type='signup' />
        </div>
    )
}