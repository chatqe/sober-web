import { getBehavior } from '@/api/generated/behavior'
import type { BehDTO } from '@/types/modules/behDTO'
import type { GetStateParams } from '@/types/modules/getStateParams'

const behavior = getBehavior()

export const viewBehavior = (data: BehDTO) => behavior.view(data)
export const dislikeBehavior = (data: BehDTO) => behavior.dislike(data)
export const undislikeBehavior = (data: BehDTO) => behavior.undislike(data)
export const subscribeBehavior = (data: BehDTO) => behavior.subscribe(data)
export const unsubscribeBehavior = (data: BehDTO) => behavior.unsubscribe(data)
export const likeBehavior = (data: BehDTO) => behavior.like(data)
export const unlikeBehavior = (data: BehDTO) => behavior.unlike(data)
export const forwardBehavior = (data: BehDTO) => behavior.forward(data)
export const unforwardBehavior = (data: BehDTO) => behavior.unforward(data)
export const commentBehavior = (data: BehDTO) => behavior.comment(data)
export const uncommentBehavior = (data: BehDTO) => behavior.uncomment(data)
export const stateBehavior = (params: GetStateParams) => behavior.getState(params)

export const behaviorApi = {
  view: viewBehavior,
  dislike: dislikeBehavior,
  undislike: undislikeBehavior,
  subscribe: subscribeBehavior,
  unsubscribe: unsubscribeBehavior,
  like: likeBehavior,
  unlike: unlikeBehavior,
  forward: forwardBehavior,
  unforward: unforwardBehavior,
  comment: commentBehavior,
  uncomment: uncommentBehavior,
  state: stateBehavior,
}
