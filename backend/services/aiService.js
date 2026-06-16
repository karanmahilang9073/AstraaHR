import Groq from "groq-sdk";
import dotenv from 'dotenv'
dotenv.config()

const groq = new Groq({
    apiKey : process.env.GROQ_API_KEY
})


export const aiResponse = async(prompt) => {
    try {
        if(!process.env.GROQ_API_KEY){
            throw new Error('GROQ_API_KEY not configured')
        }
        
        const res = await groq.chat.completions.create({
            model : 'llama-3.1-8b-instant',
            messages : [{role: 'user', content : prompt}]
        })

        if(!res.choices || !res.choices[0]) {
            throw new Error('Invalid response from GROQ API')
        }
        return res.choices[0].message.content
    } catch (error) {
        console.log('AI service error', error)
        throw error
    }
}