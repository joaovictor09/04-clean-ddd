import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-1',
      content: 'Edited content',
      title: 'Edited title',
    })

    expect(inMemoryQuestionsRepository.items[0].content).toEqual(
      'Edited content',
    )
    expect(inMemoryQuestionsRepository.items[0].title).toEqual('Edited title')
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    inMemoryQuestionsRepository.create(newQuestion)

    await expect(() =>
      sut.execute({
        questionId: newQuestion.id.toString(),
        authorId: 'author-2',
        content: 'Edited content',
        title: 'Edited title',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
