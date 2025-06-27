import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../../enterprise/entities/answer'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

interface AnswersQuestionUseCaseResponse {
  answer: Answer
}

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseRequest): Promise<AnswersQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(questionId),
      questionId: new UniqueEntityID(instructorId),
    })

    await this.answersRepository.create(answer)

    return { answer }
  }
}
