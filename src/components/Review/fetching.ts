import { Nomination, Employee, getApiUrl, toJson } from "../../fetching";

export type ShowNomination = Nomination & {
  nominatorStr: string;
  nomineeStr: string;
};

export type Answer = {
  pending: ShowNomination[];
  done: ShowNomination[];
};

function byDateAsc(a: ShowNomination, b: ShowNomination) {
  const c = +new Date(a.date);
  const d = +new Date(b.date);
  return c - d;
}

function byDateDesc(a: ShowNomination, b: ShowNomination) {
  const c = +new Date(a.date);
  const d = +new Date(b.date);
  return d - c;
}

export async function getAnswer(myEmail: string): Promise<Answer> {
  const pending: ShowNomination[] = [];
  const done: ShowNomination[] = [];
  const myEmployeeId: number = await fetch(
    getApiUrl("tblEmployees", { emailCompany: myEmail })
  )
    .then(toJson)
    .then((xs) => xs[0].employeeId);
  const noms: Nomination[] = await fetch(getApiUrl("Nominations")).then(toJson);
  for (const nom of noms) {
    const nominee: Employee = await fetch(
      getApiUrl("tblEmployees", { employeeId: nom.nominee })
    )
      .then(toJson)
      .then((xs) => xs[0]);
    if (nominee.supervisorEmployeeId === myEmployeeId) {
      const nominator: Employee = await fetch(
        getApiUrl("tblEmployees", { employeeId: nom.nominator })
      )
        .then(toJson)
        .then((xs) => xs[0]);
      const showNom: ShowNomination = {
        ...nom,
        nominatorStr: nominator.firstName + " " + nominator.lastName,
        nomineeStr: nominee.firstName + " " + nominee.lastName,
      };
      if (showNom.status === "pending") {
        pending.push(showNom);
      } else {
        done.push(showNom);
      }
    }
  }
  pending.sort(byDateAsc);
  done.sort(byDateDesc);
  return { pending, done };
}
