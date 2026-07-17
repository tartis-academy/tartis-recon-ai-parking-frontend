import { adminHandlers } from './admin'
import { entryExitHandlers } from './entry-exit'

export const handlers = [...adminHandlers, ...entryExitHandlers]
