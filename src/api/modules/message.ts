import type { MessageQueryDTO } from '../../types/modules/messageQueryDTO';
import type { PageResultMessageVO } from '../../types/modules/pageResultMessageVO';
import type { MessageSaveDTO } from '../../types/modules/messageSaveDTO';
import type { MessageReplyVO } from '../../types/modules/messageReplyVO';
import { getMessage } from '../generated/message';

const _messageApi = getMessage()

export const messageApi = {
  list: (params: MessageQueryDTO) => _messageApi.list(params) as Promise<PageResultMessageVO>,
  save: (params: MessageSaveDTO) => _messageApi.save(params),
  getReplies: (messageId: number) => _messageApi.getReplies({ messageId }) as Promise<MessageReplyVO[]>,
}
