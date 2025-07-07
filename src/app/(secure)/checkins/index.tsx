"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Input, Button } from "@/components/ui";
import { getCheckIns } from "./state/actions";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DateTime } from "luxon";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ListLoadingPage from "../components/Templates/ListLoadingPage";

function mapStateToProps(state: RootState) {
  return {
    checkIns: state.checkins.checkIns,
    checkInsLoading: state.checkins.checkInsLoading,
  };
}

const connector = connect(mapStateToProps, { getCheckIns });
type PropsFromRedux = ConnectedProps<typeof connector>;

const CheckInsDashboard: React.FC<PropsFromRedux> = ({
  checkIns,
  checkInsLoading,
  getCheckIns,
}) => {
  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
    if (!checkIns && !checkInsLoading) getCheckIns();
  }, [checkIns, checkInsLoading, getCheckIns]);

  const router = useRouter();

  const sortedCheckIns = React.useMemo(() => {
    return (
      checkIns?.slice().sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }) || []
    );
  }, [checkIns]);

  const filteredCheckIns = React.useMemo(() => {
    if (!search) return sortedCheckIns;
    return sortedCheckIns.filter(
      (checkIn) =>
        checkIn.comments?.toLowerCase().includes(search.toLowerCase()) ||
        checkIn.training?.toLowerCase().includes(search.toLowerCase()) ||
        checkIn.cheats?.toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedCheckIns, search]);

  if (checkInsLoading) {
    return <ListLoadingPage />;
  } else
    return (
      <div className="w-full">
        <div className="mb-2 flex flex-row">
          <Input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search check-ins..."
            className="col-span-3"
            type="text"
          />
          <Button
            className="ml-2"
            variant="outline"
            onClick={() => router.push("/checkins/new")}
          >
            <div className="flex">
              <Plus className="font-extrabold" />
            </div>
          </Button>
        </div>
        <Card className="w-full rounded-sm p-0">
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {filteredCheckIns?.map((checkIn, index) => (
                  <TableRow
                    key={checkIn.id}
                    onClick={() =>
                      router.push(`/checkins/checkin/${checkIn.id}`)
                    }
                    className="cursor-pointer"
                  >
                    <TableCell className="pl-8">
                      {DateTime.fromISO(checkIn.date).toFormat("LLL d, yyyy")}
                      {index === 0 && (
                        <Badge variant="secondary" className="ml-2">
                          Latest
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {checkIn.training && (
                        <div className="text-sm font-medium">
                          Training: {checkIn.training}
                        </div>
                      )}
                      {checkIn.cheats && (
                        <div className="text-xs text-muted-foreground">
                          Cheats: {checkIn.cheats}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm truncate overflow-hidden max-w-[300px] pr-8">
                      {checkIn.comments}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCheckIns?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-gray-500"
                    >
                      {search
                        ? "No check-ins found matching your search."
                        : "No check-ins yet. Create your first one!"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
};

export default connector(CheckInsDashboard);
