const base: string = "http://localhost:3000/api/";

export function getApiUrl(path: string, where?: object): string {
  if (where === undefined) {
    return base + path;
  }
  return `${base}${path}?filter=${encodeURI(JSON.stringify({ where }))}`;
}

export function toJson(res: Response): Promise<any> {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(res.statusText);
}

export type Employee = {
  id: number;
  employeeId: number;
  firstName: string;
  lastName: string;
  emailCompany: string;
  departmentName: string;
  supervisorName: string;
  supervisorEmployeeId: number;
};

export type NominationStatus = "pending" | "approved" | "denied";

export type Nomination = {
  id: number;
  reason: string;
  status: NominationStatus;
  date: string;
  nominator: number;
  nominee: number;
  award: number;
};
