"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Skeleton, Input } from "@/components/ui";
import Link from "next/link";
import { Star } from "lucide-react";
import { useWindowDimensions } from "@/app/customHooks/useWindowDimensions";
import { toggleAppFavorite } from "@/app/(secure)/state/actions";

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
  };
}

const connector = connect(mapStateToProps, { toggleAppFavorite });
type PropsFromRedux = ConnectedProps<typeof connector>;

type AppsGridPageProps = PropsFromRedux & {
  filter: string;
};

const AppsGridPage: React.FC<AppsGridPageProps> = ({
  user,
  filter,
  toggleAppFavorite,
}) => {
  const [search, setSearch] = React.useState("");
  const isMobile = useWindowDimensions("(max-width: 768px)");

  const filteredApps = user?.apps
    ?.filter((app) => {
      const matchesFilter = app.link?.includes(filter);
      const matchesSearch =
        search === "" || app.name?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    ?.sort((a, b) => {
      // First, sort by favorite status (favorites first)
      if (a.favorite !== b.favorite) {
        return b.favorite - a.favorite; // 1 (favorite) comes before 0 (not favorite)
      }
      // Then sort alphabetically by name
      return a.name?.localeCompare(b.name || "") || 0;
    });

  if (!user || !user.apps) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {Array.from({ length: isMobile ? 3 : 9 }).map((_, index) => (
          <Skeleton key={index} className="h-[200px] w-full rounded-xl" />
        ))}
      </div>
    );
  } else
    return (
      <div className="w-full mb-20">
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {filteredApps?.map((app) => (
            <div key={app.id} className="relative">
              <button
                className="absolute top-4 left-4 z-10 p-1 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleAppFavorite(user.id, app.id);
                }}
              >
                <Star
                  className={`h-5 w-5 ${
                    app.favorite === 1
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              </button>

              {/* App tile - clickable for navigation */}
              <Link href={app.link}>
                <div className="flex flex-col h-[200px] w-full text-left whitespace-normal break-words border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md px-3 py-2 text-sm cursor-pointer transition-all items-center justify-center">
                  <h2 className="text-2xl font-bold text-center">{app.name}</h2>
                  <p className="text-muted-foreground text-center py-2">
                    {app.description}
                  </p>
                  {/* Tags section - commented out for now */}
                  {/* <div className="flex w-5/6 flex-wrap gap-1 justify-center">
                    {[
                      { id: 1, name: "log" },
                      { id: 2, name: "health" },
                    ].map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div> */}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
};

export default connector(AppsGridPage);
