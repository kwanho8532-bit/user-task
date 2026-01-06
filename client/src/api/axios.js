import axios from 'axios'

const api = axios.create({
    baseURL: 'https://user-task-hdik.onrender.com' || '/api' // 앞은 render에서 배포한 express 서버 주소 뒤는 로컬서버에서 저장한 주소
})

api.interceptors.response.use(
    res => res,

    // 4️⃣ AxiosResponse 객체 구조 (res)
    // res = {
    //   data,      // 👈 서버가 보낸 실제 데이터
    //   status,    // HTTP status (200, 201 등)
    //   statusText,
    //   headers,
    //   config,    // 요청 설정
    //   request
    // }

    // 5️⃣ AxiosError 객체 구조 (err)
    // err = {
    //     message,
    //     name,
    //     code,
    //     config,
    //     request,
    //     response: {
    //         status,
    //         data,
    //         headers
    //     }
    // }

    // 📌 중요 포인트:
    // 서버가 응답한 에러 → err.response 있음
    // 네트워크 에러 → err.response 없음


    err => {
        const status = err.response?.status
        if (status === 401) {
            // 로그인 실패 관련 로직
            err.isAuthError = true // 프로퍼티 생성
            err.redirectUrl = '/signin'
        }
        if (status === 403) {
            // 권한 없음 관련 로직
            err.isAuthorityError = true

        }
        return Promise.reject(err) // 이게 없으면 에러가 났는데 성공한 것처럼 처리됨
        // axios가 Promise 기반으로 동작하기 때문에 throw보단 Promise.reject()를 사용하는 것이 의미상 맞음
    }
)

export default api

// axios.interceptors는 axios 인스턴스에 기로채기(hook)을 걸 수 있는 시스템임

// 2️⃣ interceptors의 두 종류
// ✅ 1. request interceptor => 요청이 서버로 나가기 직전
// 언제 쓰나?
// 토큰 자동 첨부, 공통 헤더 설정,요청 로그

// ✅ 2. response interceptor => 응답이 컴포넌트로 들어가기 직전
// 언제 쓰나?
// 401 → 로그인 페이지 / 403 → 권한 없음 처리 / 에러 메시지 표준화

// 3️⃣ response.use()의 정확한 시그니처
// api.interceptors.response.use(
//   onFulfilled,
//   onRejected
// )
// onFulfilled => 응답 성공(200번대)시 호출되면서 AxiosResponse를 받음
// onRejected => 읃답 실패(200번대 외)시 호출되면서 AxiosError를 받음

// 📌 AxiosError의 중요 포인트:
// 서버가 응답한 에러 → err.response 있음
// 네트워크 에러 → err.response 없음