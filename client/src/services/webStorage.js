
const setObject = (name, value) => {
  const now = new Date();

  // Set ttl 10 minutes
  const expiredAt = now.getTime() + 1000*60*10;
  
  localStorage.setItem(name, JSON.stringify({
    value,
    expiredAt,
  }));
};

const getObject = (name) => {
  const dataStr = localStorage.getItem(name);

  // if the item doesn't exist, return null  
  if (!dataStr) {
    return null;
  }

  const data = JSON.parse(dataStr)
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > data.expiredAt) {
    // If the item is expired, delete the item from storage and return null
    localStorage.removeItem(name)
    
    return null
  }

  return data.value
}

const removeObject = (name) => {
  localStorage.removeItem(name);
}

export {
  setObject,
  getObject,
  removeObject,
}