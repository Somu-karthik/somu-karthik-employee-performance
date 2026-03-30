function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev-jwt-secret'
}

export { getJwtSecret }
