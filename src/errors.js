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
    this.name = "TypeMismatchError";
  }
}

export { MissingTypeError, TypeMismatchError, InvalidTypeError }