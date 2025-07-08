export type ActionStatus = 'success' | 'warning' | 'error';

export interface ActionResult<T = undefined> {
  message: string;
  status?: ActionStatus;
  data?: T;
  stack?: string[];
}

export class ActionResultBase<T> implements ActionResult<T> {
  status: ActionStatus;
  message: string;
  data?: T;
  stack?: string[];

  constructor(
    status: ActionStatus,
    message: string,
    data?: T,
    stack?: string[]
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.stack = stack;
  }

  toPlain(): ActionResult<T> {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
      stack: this.stack,
    };
  }
}

export class ActionSuccess<T> extends ActionResultBase<T> {
  constructor(message: string, data?: T) {
    super('success', message, data);
  }
}

export class ActionWarning extends ActionResultBase<null> {
  constructor(message: string, stack?: string[]) {
    super('warning', message, undefined, stack);
  }
}

export class ActionFailed extends ActionResultBase<null> {
  constructor(message: string, stack?: string[]) {
    super('error', message, undefined, stack);
  }
}
