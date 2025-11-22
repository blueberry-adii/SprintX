export class ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T | null;

  constructor(statusCode: number, data: T | null = null, message: string) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}
