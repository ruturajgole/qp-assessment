interface User {
  readonly ID: number;
  readonly name: string;
  readonly username: string;
  readonly type: Type;
}

enum Type {
  Admin = "admin",
  User = "user"
}

export {User, Type};