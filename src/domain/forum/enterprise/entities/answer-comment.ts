import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { Comment, type CommentProps } from './comment'
import { AnswerCommentCreatedEvent } from '../events/answer-comment-created-event'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answerComment.addDomainEvent(new AnswerCommentCreatedEvent(answerComment))
    }

    return answerComment
  }
}
