class ActionResponse {
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}

class ActionSuccess extends ActionResponse {
  constructor(message: string) {
    super(message);
  }
}

class ActionFailed extends ActionResponse {
  stack?: string[];
  constructor(message: string, stack?: string[]) {
    super(message);
    this.stack = stack;
  }
}

export { ActionResponse, ActionSuccess, ActionFailed };
