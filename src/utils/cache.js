import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 20;

// 将值插入列表中，重复项删除
function insertVal(list, val, compareFn, maxLen) {
  const i = list.findIndex(compareFn);
  if (i > 0) {
    list.splice(i, 1);
  }

  if (i !== 0) {
    list.unshift(val);
  }

  if (list.length > maxLen) {
    list.pop();
  }
}

// 移除列表中的某一项
function removeVal(list, compareFn) {
  const i = list.findIndex(compareFn);
  if (i > -1) {
    list.splice(i, 1);
  }
}

function createSaveArray(key) {
  return function saveArray(handler) {
    const list = storage.get(key, []);
    handler?.(list);
    storage.set(key, list);
    return list;
  }
}

function getArray(key) {
  return storage.get(key, []);
}

function clearArray(key) {
  storage.remove(key);
  return [];
}

const saveSearchArray = createSaveArray(SEARCH_KEY);

export const history = {
  load() {
    return getArray(SEARCH_KEY);
  },
  save(val) {
    return saveSearchArray(list => insertVal(list, val, i => i === val, SEARCH_MAX_LEN));
  },
  remove(val) {
    return saveSearchArray(list => removeVal(list, i => i === val));
  },
  clear() {
    return clearArray(SEARCH_KEY);
  }
}
