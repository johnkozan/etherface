Object.filter = (obj = {}, predicate) =>
  Object.keys(obj)
    .filter( key => predicate(obj[key]) )
    .reduce( (res, key) => (res[key] = obj[key], res), {} );

function maxId(objs) {
  let max = 0;
  Object.keys(objs).forEach(key => {
    if (objs[key].__id > max) { max = objs[key].__id; }
  });
  return max;
}

export function nextId(objs = {}) {
  if (Object.keys(objs).length === 0) { return 0; }
  return maxId(objs) + 1;
};
