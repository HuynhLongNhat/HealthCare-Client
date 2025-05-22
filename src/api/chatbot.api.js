import axios from "../utils/axiosChatbotService"

export const handleAsk = (question) => {
     return axios.post("/ask" , question ,{ timeout: 300000 })
}