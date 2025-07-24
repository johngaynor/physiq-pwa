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

  const appCategories = adminApps?.reduce((acc, val) => {
    const retObj = { ...acc };
    const url = val.link.split("/");
    const substr = url[1];
    if (!retObj.substr) {
      retObj[substr] = [];
    }
    retObj[substr].push(val);
  }, {});

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
            {Object.keys(appCategories)?.map((cat) => (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{cat}</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
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
