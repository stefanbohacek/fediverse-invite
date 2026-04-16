export default (str) => RegExp.prototype.test.bind(/(<([^>]+)>)/i);
