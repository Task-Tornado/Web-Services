import React from "react";

import TeamSwitcher from "./team-switcher";

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <div>
      <TeamSwitcher />
      {props.children}
    </div>
  );
}
