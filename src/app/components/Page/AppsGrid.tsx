"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { getApps } from "../../(secure)/state/actions";
import { Button, Badge, Skeleton, Input } from "@/components/ui";
import Link from "next/link";
import { useWindowDimensions } from "@/app/customHooks/useWindowDimensions";

function mapStateToProps(state: RootState) {
  return {
    apps: state.app.apps,
    appsLoading: state.app.appsLoading,
  };
}

const connector = connect(mapStateToProps, { getApps });
type PropsFromRedux = ConnectedProps<typeof connector>;

type AppsGridPageProps = PropsFromRedux & {
  filter: string;
};

const AppsGridPage: React.FC<AppsGridPageProps> = ({
  apps,
  appsLoading,
  getApps,
  filter,
}) => {
  const [search, setSearch] = React.useState("");
  const isMobile = useWindowDimensions("(max-width: 768px)");

  React.useEffect(() => {
    if (!apps && !appsLoading) getApps();
  }, [apps, appsLoading, getApps]);

  const filteredApps = apps?.filter(
    (app) => app.link?.includes(filter) && app.link?.includes(search)
  );

  if (appsLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {Array.from({ length: isMobile ? 3 : 9 }).map((_, index) => (
          <Skeleton key={index} className="h-[200px] w-full rounded-xl" />
        ))}
      </div>
    );
  } else
    return (
      <div className="w-full">
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {filteredApps?.map((app) => (
            <Link href={app.link} key={app.id}>
              <Button
                className="flex flex-col h-[200px] w-full text-left whitespace-normal break-words"
                variant="outline"
              >
                <h2 className="text-2xl font-bold text-center">{app.name}</h2>
                <p className="text-gray-500 text-center py-2">
                  {app.description}
                </p>
                <div className="flex w-5/6 flex-wrap gap-1 justify-center">
                  {[
                    { id: 1, name: "log" },
                    { id: 2, name: "health" },
                  ].map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    );
};

export default connector(AppsGridPage);
