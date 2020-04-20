const base: string = "http://localhost:3000/api/";

// matches "tblEmployees" and "tblEmployees/..."
const tblEmployeesRE = /^tblEmployees\/?/;

export function getApiUrl(path: string, where?: object): string {
  // this is because we always want only the most recent employees from the
  // table of employees.
  if (tblEmployeesRE.test(path)) {
    where =
      where === undefined
        ? { isMostRecent: true }
        : { and: [{ isMostRecent: true }, where] };
  }
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
  isMostRecent: boolean;
};

export type NominationStatusFinal = "approved" | "denied";

export type NominationStatus = "pending" | NominationStatusFinal;

export type Nomination = {
  id: number;
  reason: string;
  status: NominationStatus;
  date: string;
  nominator: number;
  nominee: number;
  award: number;
};

export type EmployeeRecognition = {
  id: number;
  ci_bucks: number;
  admin_level: string;
};

export type NominationAward = {
  id: number;
  name: string;
  award_amount: number;
};
