/**
 * Mock server for testing and e2e
 *
 * Mock server using MSW in the Browser
 * Do not forget to
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { handlers } from './handlers'
import { setupServer } from 'msw/node'

// This configures a Service Worker with the given request handlers.
export const server = setupServer(...handlers)
