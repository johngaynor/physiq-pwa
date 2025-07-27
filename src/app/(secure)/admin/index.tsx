"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import {
  getApps,
  getUsers,
  getAppAccess,
  editAppAccess,
} from "../state/actions";
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
    appAccess: state.app.appAccess,
    appAccessLoading: state.app.appAccessLoading,
    appAccessId: state.app.appAccessId,
    users: state.app.users,
    usersLoading: state.app.usersLoading,
  };
}

const connector = connect(mapStateToProps, {
  getApps,
  getUsers,
  getAppAccess,
  editAppAccess,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const AdminConsole: React.FC<PropsFromRedux> = ({
  apps,
  appsLoading,
  getApps,
  appAccess,
  appAccessLoading,
  appAccessId,
  getAppAccess,
  users,
  usersLoading,
  getUsers,
  editAppAccess,
}) => {
  const [searchUser, setSearchUser] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!users && !usersLoading) getUsers();
    if (!apps && !appsLoading) getApps();
    if (searchUser && searchUser !== appAccessId && !appAccessLoading) {
      getAppAccess(searchUser);
    }
  }, [
    apps,
    appsLoading,
    getApps,
    users,
    usersLoading,
    getUsers,
    searchUser,
    appAccessId,
    appAccessLoading,
    getAppAccess,
  ]);

  const appCategories = apps?.reduce(
    (acc: Record<string, typeof apps>, val) => {
      const url = val.link.split("/");
      const category = url[1];
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(val);
      return acc;
    },
    {} as Record<string, typeof apps>
  );

  if (usersLoading || appsLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="w-full mb-40 flex flex-col">
      <Select disabled={!users} onValueChange={(value) => setSearchUser(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a user..." />
        </SelectTrigger>
        <SelectContent>
          {users?.map((usr) => (
            <SelectItem key={usr.id} value={usr.id}>
              {usr.name} - {usr.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!searchUser ? (
        <span className="mt-2 italic">Select a user to continue.</span>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {appCategories &&
            Object.keys(appCategories).map((cat, i) => (
              <Card
                key={"appcategory-" + i}
                className="py-0 block overflow-hidden"
              >
                <CardHeader className="flex flex-row items-center justify-center space-y-0 p-2 bg-primary dark:text-[#060B1C] text-white rounded-t-lg">
                  <CardTitle className="text-md font-bold">
                    {cat.toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {appCategories[cat].map((ap, j) => (
                    <div
                      className={`w-full flex flex-row justify-between p-4 ${
                        j % 2 === 0 ? "bg-gray-100 dark:bg-slate-900" : ""
                      }`}
                      key={"app-" + j}
                    >
                      <h3>{ap.name}</h3>
                      <Checkbox
                        checked={
                          Boolean(appAccess?.find((a) => a.id === ap.id)) ||
                          ap.allUsers === 1
                        }
                        onCheckedChange={(checked) =>
                          editAppAccess(searchUser, ap, Boolean(checked))
                        }
                        disabled={
                          Boolean(ap.allUsers) || Boolean(ap.restricted)
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
};

export default connector(AdminConsole);
