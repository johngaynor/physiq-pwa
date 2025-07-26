"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { getApps, getUsers } from "../state/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui";

function mapStateToProps(state: RootState) {
  return {
    apps: state.app.apps,
    appsLoading: state.app.appsLoading,
    adminApps: state.app.adminApps,
    adminAppsLoading: state.app.adminAppsLoading,
    users: state.app.users,
    usersLoading: state.app.usersLoading,
  };
}

const connector = connect(mapStateToProps, { getApps, getUsers });
type PropsFromRedux = ConnectedProps<typeof connector>;

const AdminConsole: React.FC<PropsFromRedux> = ({
  apps,
  appsLoading,
  adminApps,
  adminAppsLoading,
  getApps,
  users,
  usersLoading,
  getUsers,
}) => {
  const [user, setUser] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!adminApps && !adminAppsLoading) getApps();
    if (!users && !usersLoading) getUsers();
  }, [adminApps, adminAppsLoading, getApps, users, usersLoading, getUsers]);

  const appCategories = adminApps?.reduce(
    (acc: Record<string, typeof adminApps>, val) => {
      const url = val.link.split("/");
      const category = url[1];
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(val);
      return acc;
    },
    {} as Record<string, typeof adminApps>
  );

  if (adminAppsLoading || appsLoading || usersLoading) {
    return (
      <div className="w-full mb-40">
        <Select disabled={!users} onValueChange={(value) => setUser(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a user..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No user selected</SelectItem>
            {users?.map((usr) => (
              <SelectItem key={usr.id} value={usr.id}>
                {usr.name} - {usr.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!user ? (
          <h1>Select a user to continue.</h1>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {appCategories &&
              Object.keys(appCategories).map((cat, i) => (
                <Card key={"appcategory-" + i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{cat}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appCategories[cat].map((ap, j) => (
                      <div
                        className="w-full flex flex-row justify-between p-4"
                        key={"app-" + j}
                      >
                        <h3>{ap.name}</h3>
                        <Checkbox
                          checked={Boolean(apps?.find((a) => a.id))}
                          onCheckedChange={(checked) =>
                            console.log(`App ${ap.name} checked: ${checked}`)
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    );
  }

  return <h1>admin</h1>;
};

export default connector(AdminConsole);
