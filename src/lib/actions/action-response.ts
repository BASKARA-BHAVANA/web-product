export interface IActionResponse {
  message: string;
}

export type IActionSuccess = IActionResponse;

export interface IActionFailed extends IActionResponse {
  stack?: string[];
}

class ActionResponse implements IActionResponse {
  message: string;
  constructor(message: string) {
    this.message = message;
  }

  toPlain(): IActionResponse {
    return {
      message: this.message,
    };
  }
}

class ActionSuccess extends ActionResponse implements IActionSuccess {
  constructor(message: string) {
    super(message);
  }

  toPlain(): IActionSuccess {
    return {
      message: this.message,
    };
  }
}

class ActionFailed extends ActionResponse implements IActionFailed {
  stack?: string[];
  constructor(message: string, stack?: string[]) {
    super(message);
    this.stack = stack;
  }

  toPlain(): IActionFailed {
    return {
      message: this.message,
      stack: this.stack,
    };
  }
}

export { ActionResponse, ActionSuccess, ActionFailed };
