import './server/utils/azureAppInsights'

import logger from './logger'
import app from './server/index'

app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`)
})
