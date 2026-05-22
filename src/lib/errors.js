class MissingTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = "MissingTypeError";
  }
}

class TypeMismatchError extends Error {
  constructor(message) {
    super(message);
    this.name = "TypeMismatchError";
  }
}

class InvalidTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidTypeError";
  }
}

export { MissingTypeError, TypeMismatchError, InvalidTypeError }