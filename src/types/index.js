/**
 * @typedef {Object} Recipe
 * @property {string} id
 * @property {string} user_id
 * @property {string} name
 * @property {Array<{name: string, quantity: string}>} ingredients
 * @property {string[]} steps
 * @property {number} prep_time
 * @property {number} cook_time
 * @property {string} category
 * @property {string} image_url
 * @property {string} created_at
 */

/**
 * @typedef {Object} Family
 * @property {string} id
 * @property {string} name
 * @property {string} created_at
 */

/**
 * @typedef {Object} FamilyMember
 * @property {string} id
 * @property {string} family_id
 * @property {string} user_id
 */

export {}
