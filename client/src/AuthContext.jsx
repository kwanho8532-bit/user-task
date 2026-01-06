import { useState } from "react"
import { useEffect } from "react"
import api from "./api/axios"
import { useContext } from "react"
import { createContext } from "react"
import { useMemo } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/me', { withCredentials: true }) // 브라우저에 저장된 쿠키(session iD 포함)를 함께 보내는 옵션
            // connect.sid를 보내야 그걸 통해 passport.deserializeUser가 req.user를 생성함
            .then(res => setUser(res.data.user))
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const value = useMemo(() => ({ user, setUser }), [user])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}

// 내일 다시 공부 해당 부분 & 같은 앱인데 다른 ui로 만들어보기(최대한 안보고)
