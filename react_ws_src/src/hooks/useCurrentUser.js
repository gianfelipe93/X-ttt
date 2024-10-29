import { pick } from 'lodash'

const useCurrentUser = (selector = []) => {
  // eslint-disable-next-line no-undef
  const user = app.settings.curr_user

  if (!user) return {
    valid: false
  }
  let userInfo = pick(user, selector)
  userInfo.valid = true

  return userInfo
}

export default useCurrentUser