type Spread<Type> = { [Key in keyof Type]: Type[Key] }

// Base types from DB columns
interface Base {
  created_at: string
  updated_at: string
}
export interface User extends Base {
  id: number
  first_name: string
  last_name: string
  username: string
  email: string
}
export interface Question extends Base {
  id: number
  user_id: number
  total_score: number
  title: string
  content: string
}
export interface Answer extends Base {
  id: number
  user_id: number
  question_id: number
  accepted: boolean
  content: string
}
export interface Comment extends Base {
  id: number
  user_id: number
  content_type: "question" | "answer"
  content_id: number
  content: string
}
export interface Save extends Base {
  id: number
  user_id: number
  content_type: "question" | "answer"
  content_id: number
  parent_type: "answer" | null
}
export interface Tag extends Base {
  id: number
  name: string
}
export interface Vote extends Base {}
export type UnifiedQuestion = Spread<Question>
export type UnifiedAnswer = Spread<Answer>
export type UnifiedComment = Spread<Comment>

export interface FetchAllQuestionsResponse {
  questions: Spread<
    Omit<Question, "user_id"> & {
      user: User & {
        votes: Vote[]
      }
      answers: (Answer & {
        comments: (Comment & {
          saves: (Save & {
            user: User[]
          })[]
        })[]
        saves: Save[]
      })[]
      comments: Comment[]
      saves: Save[]
      tags: Tag[]
    }
  >[]
}
export type UnifiedFetchAllQuestionsResponse = Spread<FetchAllQuestionsResponse>
