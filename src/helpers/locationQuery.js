// Taken from https://stackoverflow.com/a/47444474/771834
export default window.location.search.slice(1).split('&').map(p => p.split('=')).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
