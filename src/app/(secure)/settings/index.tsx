"use client";

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { H4 } from "@/components/ui";
import { FieldSelect } from "../components/Forms/FieldSelect";
import { editDashboardSettings } from "../state/actions";

function mapStateToProps(state: RootState) {
  return { user: state.app.user };
}

const connector = connect(mapStateToProps, { editDashboardSettings });
type PropsFromRedux = ConnectedProps<typeof connector>;

const settingsOptions = {
  dates: [
    { value: 0, text: "Yesterday" },
    { value: 1, text: "Today" },
  ],
  inputTypes: [
    { value: 0, text: "Replace" },
    { value: 1, text: "Add" },
  ],
};

const SettingsPage: React.FC<PropsFromRedux> = ({
  user,
  editDashboardSettings,
}) => {
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading user settings...</div>
      </div>
    );
  }

  const {
    dashboardStepsToday,
    dashboardCaloriesToday,
    dashboardCaloriesAdd,
    dashboardWaterToday,
    dashboardWaterAdd,
  } = user.settings;

  function handleChange({
    key,
    value,
  }: {
    key: string;
    value: string | number;
  }) {
    editDashboardSettings(key, value);
  }

  return (
    <div>
      <div className="border-1 rounded-lg p-6 dark:bg-[#060B1C]">
        <H4>Dashboard Settings</H4>
        <p className="text-md py-3 text-muted-foreground">
          These settings determine how each of the dashboard inputs behave.
        </p>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldSelect
              label="Water Input Day"
              selectId="dashboardWaterToday"
              options={settingsOptions.dates}
              onChange={handleChange}
              value={dashboardWaterToday}
              tooltip="Do you want to edit today's water intake or yesterday's?"
            />
            <FieldSelect
              label="Water Input Method"
              selectId="dashboardWaterAdd"
              options={settingsOptions.inputTypes}
              onChange={handleChange}
              value={dashboardWaterAdd}
              tooltip="Do you want to replace the existing value or add/subtract from it?"
            />
            <FieldSelect
              label="Calories Input Day"
              selectId="dashboardCaloriesToday"
              options={settingsOptions.dates}
              onChange={handleChange}
              value={dashboardCaloriesToday}
              tooltip="Do you want to edit today's calories or yesterday's?"
            />
            <FieldSelect
              label="Calories Input Method"
              selectId="dashboardCaloriesAdd"
              options={settingsOptions.inputTypes}
              onChange={handleChange}
              value={dashboardCaloriesAdd}
              tooltip="Do you want to replace the existing value or add/subtract from it?"
            />
            <FieldSelect
              label="Steps Input Day"
              selectId="dashboardStepsToday"
              options={settingsOptions.dates}
              onChange={handleChange}
              value={dashboardStepsToday}
              tooltip="Do you want to edit today's steps or yesterday's?"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(SettingsPage);
