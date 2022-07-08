declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GLPI_DB_HOST: string
      GLPI_DB_NAME: string
      GLPI_DB_USER: string
      GLPI_DB_PASS: string
    }
  }
}

export {}
