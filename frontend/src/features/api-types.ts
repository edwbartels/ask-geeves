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
export interface Vote extends Base {
  content_type: "question" | "answer"
  content_id: number
  value: -1 | 0 | 1
}
export type UnifiedQuestion = Spread<Question>
export type UnifiedAnswer = Spread<Answer>
export type UnifiedComment = Spread<Comment>

export type APIVote = {
  content_type: "question" | "answer"
  content_id: number
  value: -1 | 0 | 1
}
export type APISave = Save & {
  User: APIUser
}
export type APITag = {
  id: number
  name: string
}
export type APIUser = User & {
  Votes: APIVote[]
}
export type APIComment = Comment & {
  User: APIUser
  Saves: APISave[]
}
export type APIAnswer = Answer & {
  User: APIUser
  Comments: APIComment[]
  Saves: APISave[]
}
export interface FetchAllQuestionsResponse_old {
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
export interface FetchAllQuestionsResponse {
  questions: {
    // base Questions table columns
    id: number
    // user_id is repeated in the User field, but ok to leave it in if removing is too hard
    user_id: number
    title: string
    content: string
    created_at: string // datetime string is fine
    updated_at: string

    total_score: number // db aggregate function
    num_votes: number // only votes that are not 0
    num_answers: number // db aggregate function

    // user object that matches questioni writer
    User: User & {
      Votes: APIVote[]
    }

    // array of tag objects
    Tags: {
      id: number
      name: string
    }[]
  }[]

  // pagination options
  page: number
  size: number
  // db aggregate function to count num questions and divide by size?
  num_pages: number
}

export interface FetchOneQuestionResponse {
  question: {
    // base Questions table columns
    id: number
    // user_id is repeated in the User field, but ok to leave it in if removing is too hard
    // user_id: number
    title: string
    content: string
    created_at: string // datetime string is fine
    updated_at: string

    total_score: number // db aggregate function
    num_votes: number // only votes that are not 0
    num_answers: number // db aggregate function

    // array of tag objects
    Tags: {
      id: number
      name: string
    }[]

    // array of vote objects that matches the logged in session user
    Votes: {
      content_type: "question" | "answer"
      content_id: number
      value: -1 | 0 | 1
    }[]

    // user object that matches question writer
    QuestionUser: {
      id: number
      first_name: string
      last_name: string
      username: string
    }

    // array of comment objects
    Comments: {
      id: number
      user_id: number
      content_type: "question"
      content_id: number
      content: string
      total_score: number
      created_at: string
      updated_at: string

      // user object that matches question-comment writer
      CommentUser: {
        id: number
        first_name: string
        last_name: string
        username: string
      }
    }[]

    // array of answer+user+comment objects
    // may move to a separate "get answers by questionId" endpoint
    Answers: {
      id: number
      // user_id: number
      question_id: number
      accepted: boolean
      content: string
      created_at: string
      updated_at: string
      num_comments: number
      total_score: number // db aggregate function

      // user object that matches answer writer
      AnswerUser: {
        id: number
        first_name: string
        last_name: string
        username: string
      }

      // array of comment objects
      Comments: {
        id: number
        user_id: number
        content_type: "answer"
        content_id: number
        content: string
        total_score: number
        created_at: string
        updated_at: string

        // user object that matches answer-comment writer
        CommentUser: {
          id: number
          first_name: string
          last_name: string
          username: string
        }
      }[]
    }[]
  }
}
export type UnifiedFetchAllQuestionsResponse = Spread<FetchAllQuestionsResponse>
