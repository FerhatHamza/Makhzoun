const BASE_URL = "https://makhzoun-api.ferhathamza17.workers.dev/api";

/**
 * Generic request helper
 */
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }

  return res.status === 204 ? null : res.json();
}

/**
 * CRUD API
 */
export const api = {
  // GET all rows
  getAll(table) {
    return request(`${BASE_URL}/${table}`);
  },

  // GET single row
  getOne(table, id) {
    return request(`${BASE_URL}/${table}/${id}`);
  },

  // CREATE
  create(table, data) {
    console.log("Creating", table, data);
    return request(`${BASE_URL}/${table}`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  // UPDATE
  update(table, id, data) {
    return request(`${BASE_URL}/${table}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  // DELETE
  remove(table, id) {
    return request(`${BASE_URL}/${table}/${id}`, {
      method: "DELETE"
    });
  }
};
