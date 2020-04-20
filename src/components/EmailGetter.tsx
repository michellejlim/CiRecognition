// this is not the greatest. It would be better if we could know the
// currently signed-in person's email through better means, perhaps via an API
// request.

import React from "react";

type Props = {
  onGetEmail: (x: string) => void;
};

type MGTPerson = {
  personDetails: {
    mail: string | null;
  } | null;
};

export default function EmailGetter({ onGetEmail }: Props) {
  const me = React.useRef<MGTPerson | null>(null);
  React.useEffect(() => {
    function tryGetEmail() {
      if (
        me.current == null ||
        me.current.personDetails == null ||
        me.current.personDetails.mail == null
      ) {
        setTimeout(tryGetEmail, 1000);
        return;
      }
      onGetEmail(me.current.personDetails.mail);
    }
    tryGetEmail();
  }, [onGetEmail]);
  return (
    <div style={{ display: "none" }}>
      <mgt-person person-query="me" show-email ref={me}></mgt-person>
    </div>
  );
}
