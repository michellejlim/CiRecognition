const base: string = "http://localhost:3000/api/";

export function getApiUrl(x: string): string {
  return base + encodeURI(x);
}

export function toJson(res: Response): Promise<any> {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(res.statusText);
}

export type Employee = {
  employeeId: number;
  firstName: string;
  lastName: string;
};
