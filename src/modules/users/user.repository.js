import { query } from '../../config/db.js';

export const findByEmail = async (email) => {
  const sql = `
    SELECT id, email, password_hash, full_name, created_at 
    FROM users 
    WHERE email = $1
  `;
  const { rows } = await query(sql, [email]);
  return rows[0] || null;
};

export const findById = async (id) => {
  const sql = `
    SELECT id, email, full_name, created_at 
    FROM users 
    WHERE id = $1
  `;
  const { rows } = await query(sql, [id]);
  return rows[0] || null;
};

export const createUser = async ({ email, passwordHash, fullName }) => {
  const sql = `
    INSERT INTO users (email, password_hash, full_name)
    VALUES ($1, $2, $3)
    RETURNING id, email, full_name, created_at
  `;
  const { rows } = await query(sql, [email, passwordHash, fullName]);
  return rows[0];
};