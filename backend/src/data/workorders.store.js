const store = new Map(); // id -> workorder

function all() {
  return Array.from(store.values());
}

function get(id) {
  return store.get(id) || null;
}

function set(item) {
  store.set(item.id, item);
  return item;
}

function del(id) {
  return store.delete(id);
}

module.exports = { all, get, set, del };