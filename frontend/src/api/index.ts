import axios, { AxiosError, AxiosResponse } from "axios"
import { z } from "zod"

const client = axios.create({
  baseURL: "http://localhost:8080"
})

const getMessages = async (since?: string): Promise<AxiosResponse | null> => {
  try {
    const params = since ? { since } : { }
    const response = await client.get("/api/messages", { params })
    return response
  } catch (error) {
    return (error as AxiosError).response || null
  }
}

const MessageSchema = z.object({
  user: z.string(),
  message: z.string(),
  createdAt: z.string().datetime({ offset: true })
})

export type Message = z.infer<typeof MessageSchema>

const validateMessages = (response: AxiosResponse): Message[] | null => {
  const result = MessageSchema.array().safeParse(response.data)
  if (!result.success) {
    return null
  }
  return result.data
}

type Response<Type> = {
  data: Type
  status: number
  success: true
} | {
  status: number
  success: false
}

export const loadMessages = async (title?: string): Promise<Response<Message[]>> => {
  const response = await getMessages(title)
  if (!response)
    return { success: false, status: 0  }
  if (response.status !== 200)
    return { success: false, status: response.status  }
  const data = validateMessages(response)
  if (!data)
    return { success: false, status: response.status  }
  return { success: true, status: response.status, data }
}