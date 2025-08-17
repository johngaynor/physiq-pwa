"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Input, Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import { getTestData } from "./state/actions";

function mapStateToProps(state: RootState) {
  return {
    testData: state.development.testData,
    testDataLoading: state.development.testDataLoading,
  };
}

const connector = connect(mapStateToProps, { getTestData });
type PropsFromRedux = ConnectedProps<typeof connector>;

const Development: React.FC<PropsFromRedux> = ({
  testData,
  testDataLoading,
  getTestData,
}) => {
  const [route, setRoute] = React.useState("/api/training/train/sessions/all");

  const handleFetchData = () => {
    getTestData(route);
  };

  return (
    <div className="w-full p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Development Testing</h1>
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <Input
              placeholder="Enter API route (e.g., /api/training/exercises)"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleFetchData}
              disabled={testDataLoading || !route.trim()}
              className="min-w-32"
            >
              {testDataLoading ? "Fetching..." : "Fetch Data"}
            </Button>
          </div>
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Response Data</h2>
            {testDataLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading...</div>
              </div>
            )}
            {!testDataLoading && testData && (
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
                  <code>{JSON.stringify(testData, null, 2)}</code>
                </pre>
              </div>
            )}
            {!testDataLoading && !testData && (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                No data available. Click "Fetch Data" to load.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default connector(Development);
