export interface SeedUser {
  name: string
  email: string
  password: string
  hostel: string
}

// DEMO ONLY — checked in the browser, so not real security.
// Replace with the Laravel backend later.
export const SEED_USERS: SeedUser[] = [
  { name: 'Test User', email: 'test@vit.ac.in', password: 'test1234', hostel: 'MH - B Block' },
]