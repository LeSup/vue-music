import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 20;

const FANCY_KEY = '__fancy__';
const FANCY_MAX_LEN = 20;

const PLAY_KEY = '__play__';
const PLAY_MAX_LEN = 20;

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

export const search = {
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

const saveFancyArray = createSaveArray(FANCY_KEY);

export const fancy = {
  load() {
    return getArray(FANCY_KEY);
  },
  save(val) {
    return saveFancyArray(list => insertVal(list, val, i => i.id === val.id, FANCY_MAX_LEN));
  },
  remove(val) {
    return saveFancyArray(list => removeVal(list, i => i.id === val.id));
  }
}

const savePlayArray = createSaveArray(PLAY_KEY);

export const play = {
  load() {
    return getArray(PLAY_KEY);
  },
  save(val) {
    return savePlayArray(list => insertVal(list, val, i => i.id === val.id, PLAY_MAX_LEN));
  }
}
