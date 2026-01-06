import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
  // react에서 요청이 발생 -> vite의 포트인 5173으로 들어가게됨
  // 그럼 express(3000 포트)으로 안들어감 -> vite에서 http://localhost:5173/api/users 이렇게 해석됨
  // -> 근데 vite에는 /api/users 라우트가 없어서 index.html을 돌려줌()
  // 그렇기 때문에 위와 같이 proxy를 설정해줘야함
})
